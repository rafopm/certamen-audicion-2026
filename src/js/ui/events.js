/**
 * Manejo centralizado de eventos de la aplicación.
 * Conecta la UI con los servicios del backend, auditoría y control de proyección.
 */
import { DOM } from './dom.js';
import { appState } from '../core/state.js';
import { api } from '../services/api.js';
import { CONFIG, getRoundOptionLabel } from '../config.js';
import { getResponsesForAudition, isAuditionSaved } from '../core/rules.js';
import { renderAlumnos, renderAudiciones, renderRanking } from './render.js';
import { bindRoundTimeline, renderRoundTimeline } from './round-timeline.js';
import { isValidRonda, extractFileId, isValidFileId, normalizeAnswer } from '../utils/validators.js';

let isPlaying = false;
let isRequestingPlayback = false;
let currentAudicionIndex = 1;
let playStartTime = null;
let currentPlayingAudData = null;
let currentPlaybackInfo = { startSec: 0, endSec: 40, duration: 40 };
let projectorCommandId = null;
let projectorPollTimeout = null;
let projectorPlaybackStarted = false;
let projectorStopPending = false;

/**
 * Configura todos los event listeners de la aplicación
 */
export function setupEventListeners() {
  DOM.init();
  currentAudicionIndex = appState.get().audicionActual || 1;
  bindRoundTimeline(DOM.get('selectRonda'));
  renderRoundTimeline();

  // 1. CLICK EN PLAY / DETENER
  const btnPlay = DOM.get('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', async () => {
      const currentState = appState.get();
      if (isHistoricalRoundView(currentState) || currentState.rondaCerrada) {
        DOM.showToast('La reproducción solo está disponible en la ronda activa y abierta.', 'warning');
        return;
      }
      if (isPlaying) {
        cancelarReproduccionProyector();
        return;
      }
      if (isRequestingPlayback) return;
      isRequestingPlayback = true;
      setPlayButtonLoading(true);

      const state = appState.get();
      const ronda = state.rondaActual || 1;

      // Obtener o cargar audiciones de la ronda si aún no están en memoria
      let audiciones = state.audicionesRonda || [];
      if (!audiciones || audiciones.length === 0) {
        DOM.showLoading('Obteniendo audición configurada...');
        try {
          const audRes = await api.getAudicionesRonda(ronda);
          audiciones = audRes.data || [];
          appState.set({ audicionesRonda: audiciones });
        } catch (err) {
          console.error('[AUDIO] No se pudieron cargar audiciones desde backend:', err);
          DOM.showToast('No se pudo cargar el sorteo de audiciones.', 'error');
          isRequestingPlayback = false;
          resetPlayButtonState();
          return;
        } finally {
          DOM.hideLoading();
        }
      }

      // Buscar audición actual
      const audicionActualData = audiciones.find(a => a.audicionNum === currentAudicionIndex) || audiciones[currentAudicionIndex - 1] || {};
      if (!audicionActualData.cancionId) {
        DOM.showToast('No hay un sorteo guardado para esta audición. Configura las canciones y genera el sorteo.', 'warning', 4500);
        isRequestingPlayback = false;
        resetPlayButtonState();
        return;
      }
      currentPlayingAudData = audicionActualData;
      const cleanFileId = extractFileId(audicionActualData.driveId || audicionActualData.archivoDriveId);
      if (!isValidFileId(cleanFileId)) {
        DOM.showToast('La canción asignada no tiene un identificador de archivo válido.', 'error', 4500);
        isRequestingPlayback = false;
        resetPlayButtonState();
        return;
      }

      const chkRandom = document.getElementById('chk-random-start');
      const isRandomStart = chkRandom ? chkRandom.checked : true;

      try {
        const commandId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        projectorCommandId = commandId;
        projectorPlaybackStarted = false;
        const response = await api.solicitarReproduccionProyector({
          commandId,
          ronda,
          audicionNum: currentAudicionIndex,
          fileId: cleanFileId,
          randomStart: isRandomStart
        });
        if (response.data && response.data.status !== 'loading') {
          throw new Error('El proyector no aceptó la orden de reproducción.');
        }

        isPlaying = true;
        setPlayButtonActive(true);
        setProjectorStatus(`⏳ Enviando audición ${currentAudicionIndex} al proyector...`);
        pollProjectorPlayback(commandId);
      } catch (error) {
        if (projectorCommandId) {
          try {
            const current = await api.getReproduccionProyector();
            if (current.data && String(current.data.commandId) === projectorCommandId &&
                ['loading', 'countdown', 'playing'].includes(current.data.status)) {
              isPlaying = true;
              setPlayButtonActive(true);
              setProjectorStatus('✅ La orden fue recibida; sincronizando con el proyector...');
              pollProjectorPlayback(projectorCommandId);
              return;
            }
          } catch (reconcileError) {
            console.error('[PROYECTOR] No se pudo confirmar la orden:', reconcileError);
          }
        }
        console.error('[PROYECTOR] No se pudo solicitar la reproducción:', error);
        projectorCommandId = null;
        isPlaying = false;
        setProjectorStatus('⚠️ No se pudo iniciar la reproducción en el proyector.');
        DOM.showToast(`No se pudo iniciar la audición: ${error.message}`, 'error', 5000);
        resetPlayButtonState();
      } finally {
        isRequestingPlayback = false;
        setPlayButtonLoading(false);
      }
    });
  }

  // 2. NAVEGACIÓN MANUAL DE AUDICIÓN (ANTERIOR / SIGUIENTE)
  const btnPrev = document.getElementById('btn-prev-audicion');
  const btnNext = document.getElementById('btn-next-audicion');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentAudicionIndex > 1) {
        if (isCurrentAuditionDirty() && !window.confirm('Hay respuestas sin guardar. ¿Descartarlas y volver a la audición anterior?')) return;
        currentAudicionIndex--;
        actualizarAudicionActualEnApp(currentAudicionIndex);
        updateAuditionControls();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const state = appState.get();
      const configRonda = CONFIG.ROUNDS[state.rondaActual] || { audiciones: 4 };
      if (isPlaying) {
        DOM.showToast('Espera a que termine el audio antes de cambiar de audición.', 'warning');
        return;
      }
      if (!isCurrentAuditionSaved() || isCurrentAuditionDirty()) {
        DOM.showToast('Verifica y guarda las respuestas de esta audición antes de avanzar.', 'warning', 4000);
        return;
      }
      if (currentAudicionIndex < configRonda.audiciones) {
        currentAudicionIndex++;
        actualizarAudicionActualEnApp(currentAudicionIndex);
        updateAuditionControls();
      }
    });
  }

  // 3. CAMBIO DE MODO PROYECTOR DESDE EL PANEL DEL JURADO
  const modoBotones = {
    'AUDICION': document.getElementById('btn-modo-audicion'),
    'CLASIFICADOS': document.getElementById('btn-modo-clasificados'),
    'RANKING_FINAL': document.getElementById('btn-modo-ranking')
  };

  Object.entries(modoBotones).forEach(([modo, btn]) => {
    if (btn) {
      btn.addEventListener('click', async () => {
        const state = appState.get();
        const todasLasRondasCompletadas = Array.from(
          { length: CONFIG.TOTAL_RONDAS },
          (_, index) => CONFIG.COMPLETED_ROUNDS[index + 1]
        ).every(Boolean);
        if (modo === 'CLASIFICADOS' && !state.rondaCerrada) {
          DOM.showToast('Finaliza la ronda actual antes de mostrar los clasificados.', 'warning');
          return;
        }
        if (modo === 'RANKING_FINAL' && !todasLasRondasCompletadas) {
          DOM.showToast('Finaliza todas las rondas antes de mostrar el ranking final.', 'warning');
          return;
        }

        try {
          await api.actualizarModoProyector(modo);
          actualizarEstiloBotonesProyector(modo, modoBotones);
          DOM.showToast(`Proyector configurado en: ${modo}`, 'info', 2000);
        } catch (err) {
          console.error('Error al sincronizar modo proyector:', err);
          DOM.showToast('No se pudo cambiar el modo del proyector: ' + err.message, 'error');
        }
      });
    }
  });

  // 4. CAMBIO DE RONDA (SECUENCIA)
  const selectRonda = DOM.get('selectRonda');
  if (selectRonda) {
    selectRonda.addEventListener('change', async (e) => {
      const nuevaRonda = parseInt(e.target.value, 10);
      if (!isValidRonda(nuevaRonda)) {
        DOM.showToast('Ronda inválida', 'error');
        return;
      }

      const stateActual = appState.get();
      const rondaActiva = Number(stateActual.rondaActual) || 1;
      const rondaSeleccionada = Number(stateActual.rondaVista) || rondaActiva;
      if (isPlaying) {
        e.target.value = String(rondaSeleccionada);
        DOM.showToast('Espera a que termine el audio antes de cambiar de ronda.', 'warning');
        return;
      }
      if (nuevaRonda < rondaActiva && !CONFIG.COMPLETED_ROUNDS[nuevaRonda]) {
        e.target.value = String(rondaSeleccionada);
        DOM.showToast('Solo se pueden consultar rondas que ya fueron completadas.', 'warning');
        return;
      }
      if (nuevaRonda > rondaActiva &&
          (nuevaRonda !== rondaActiva + 1 || !stateActual.rondaCerrada)) {
        e.target.value = String(rondaSeleccionada);
        DOM.showToast('Finaliza la ronda activa antes de iniciar la siguiente.', 'warning', 4000);
        return;
      }

      DOM.showLoading(`Cargando Ronda ${nuevaRonda}...`);
      try {
        currentAudicionIndex = 1;

        if (nuevaRonda < rondaActiva) {
          const [audRes, resRes, respuestasRes] = await Promise.all([
            api.getAudicionesRonda(nuevaRonda),
            api.getResultados(nuevaRonda),
            api.getRespuestasRonda(nuevaRonda)
          ]);
          appState.set({
            rondaVista: nuevaRonda,
            rondaHistorial: {
              ronda: nuevaRonda,
              audicionesRonda: audRes.data || [],
              resultados: resRes.data || [],
              respuestasAudicion: respuestasRes.data || []
            },
            audicionActual: 1
          });
        } else if (nuevaRonda === rondaActiva) {
          appState.set({
            rondaVista: rondaActiva,
            rondaHistorial: null,
            audicionActual: 1
          });
        } else {
          const [audRes, resRes, alRes, respuestasRes] = await Promise.all([
            api.getAudicionesRonda(nuevaRonda),
            api.getResultados(nuevaRonda),
            api.getAlumnos(),
            api.getRespuestasRonda(nuevaRonda)
          ]);

          await api.actualizarRondaActual(nuevaRonda);
          appState.set({
            rondaActual: nuevaRonda,
            rondaVista: nuevaRonda,
            rondaHistorial: null,
            rondaCerrada: Boolean(CONFIG.COMPLETED_ROUNDS[nuevaRonda]),
            audicionActual: 1,
            audicionesRonda: audRes.data || [],
            resultados: resRes.data || [],
            alumnos: alRes.data || [],
            respuestasAudicion: respuestasRes.data || []
          });
          actualizarEstiloBotonesProyector('AUDICION', modoBotones);
        }

        renderRoundView();
        renderRoundTimeline();

        const configRonda = CONFIG.ROUNDS[nuevaRonda] || { duracion: 40 };
        actualizarBadgeRangoUI(0, configRonda.duracion);
        updateAuditionControls();
        DOM.showToast(
          nuevaRonda < rondaActiva
            ? `Consulta de Ronda ${nuevaRonda} · solo lectura`
            : `Ronda ${nuevaRonda} activa`,
          'success'
        );
      } catch (err) {
        console.error('Error al cambiar ronda:', err);
        currentAudicionIndex = stateActual.audicionActual || 1;
        e.target.value = String(rondaSeleccionada);
        renderRoundTimeline();
        renderRoundView();
        updateAuditionControls();
        DOM.showToast('Error al cambiar de ronda: ' + err.message, 'error');
      } finally {
        DOM.hideLoading();
      }
    });
  }

  // 5. VALIDACIÓN DE PIZARRAS EN TIEMPO REAL (INPUT DE TEXTO O CÓDIGO)
  const listaAlumnos = DOM.get('listaAlumnos');
  if (listaAlumnos) {
    listaAlumnos.addEventListener('input', (e) => {
      if (e.target && e.target.classList.contains('input-pizarra-alumno')) {
        const alumnoId = e.target.dataset.alumnoId;
        const valorEscrito = e.target.value.trim().toUpperCase();

        const state = appState.get();
        const audiciones = state.audicionesRonda || [];
        const audData = audiciones.find(a => a.audicionNum === currentAudicionIndex) || audiciones[currentAudicionIndex - 1] || {};
        const codigoEsperado = normalizeAnswer(audData.cancionCodigo);
        const nombreEsperado = normalizeAnswer(audData.cancionNombre);

        const card = [...listaAlumnos.querySelectorAll('[data-alumno-card]')]
          .find(item => item.getAttribute('data-alumno-card') === alumnoId);
        if (!card) return;

        const checkboxActual = card.querySelector(`.checkbox-acierto[data-audicion="${currentAudicionIndex}"]`);
        const respuesta = normalizeAnswer(e.target.value);
        const esCorrecta = respuesta !== '' && (respuesta === codigoEsperado || respuesta === nombreEsperado);

        if (esCorrecta) {
          e.target.classList.remove('border-slate-700', 'border-rose-500');
          e.target.classList.add('border-emerald-400', 'bg-emerald-950/60');
          if (checkboxActual && !checkboxActual.checked) {
            checkboxActual.checked = true;
            actualizarContadorAciertosAlumno(card, alumnoId);
          }
        } else if (valorEscrito === '') {
          e.target.classList.remove('border-emerald-400', 'bg-emerald-950/60', 'border-rose-500');
          e.target.classList.add('border-slate-700');
          if (checkboxActual) checkboxActual.checked = false;
        } else {
          e.target.classList.remove('border-emerald-400', 'bg-emerald-950/60', 'border-slate-700');
          e.target.classList.add('border-rose-500');
          if (checkboxActual) checkboxActual.checked = false;
        }
        actualizarContadorAciertosAlumno(card, alumnoId);
        updateAuditionControls();
      }
    });

    listaAlumnos.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('checkbox-acierto')) {
        const alumnoId = e.target.dataset.alumnoId;
        const card = document.querySelector(`[data-alumno-card="${alumnoId}"]`);
        if (card) {
          actualizarContadorAciertosAlumno(card, alumnoId);
        }
        updateAuditionControls();
      }
    });
  }

  // Guardar respuesta de cada participante para la audición actual.
  const btnGuardarAciertos = DOM.get('btnGuardarAciertos');
  if (btnGuardarAciertos) {
    btnGuardarAciertos.addEventListener('click', async () => {
      const state = appState.get();
      if (isHistoricalRoundView(state)) {
        DOM.showToast('Las rondas históricas son de solo lectura.', 'warning');
        return;
      }
      const ronda = state.rondaActual || 1;
      const audicionNum = currentAudicionIndex;
      if (isPlaying) {
        DOM.showToast('Espera a que termine el audio antes de guardar respuestas.', 'warning');
        return;
      }

      const participantes = getParticipantesRonda(state);
      const cards = [...document.querySelectorAll('[data-alumno-card]')];
      let respuestas;
      try {
        respuestas = participantes.map(alumno => {
          const card = cards.find(item => item.getAttribute('data-alumno-card') === String(alumno.id));
          if (!card) throw new Error(`No se encontró la ficha del participante ${alumno.id}.`);
          const input = card.querySelector(`.input-pizarra-alumno[data-audicion="${audicionNum}"]`);
          const checkbox = card.querySelector(`.checkbox-acierto[data-audicion="${audicionNum}"]`);
          const respuesta = input ? input.value.trim() : '';
          return {
            alumnoId: alumno.id,
            respuesta,
            correcto: respuesta !== '' && Boolean(checkbox && checkbox.checked)
          };
        });
      } catch (err) {
        console.error('Error al preparar respuestas:', err);
        DOM.showToast('Error al preparar respuestas: ' + err.message, 'error');
        return;
      }

      if (respuestas.length === 0) {
        DOM.showToast('No hay participantes elegibles para guardar.', 'warning');
        return;
      }

      DOM.showLoading('Guardando respuestas de esta audición...');
      try {
        await api.guardarRespuestasAudicion({
          ronda,
          audicionNum,
          respuestas
        });

        const [respuestasRes, resultadosRes] = await Promise.all([
          api.getRespuestasRonda(ronda),
          api.getResultados(ronda)
        ]);
        appState.set({
          respuestasAudicion: respuestasRes.data || [],
          resultados: resultadosRes.data || []
        });
        renderAlumnos(appState.get());
        renderAudiciones(appState.get());
        updateAuditionControls();
        const correctos = respuestas.filter(respuesta => respuesta.correcto).length;
        DOM.showToast(
          `Audición ${audicionNum} guardada: ${correctos} correctas y ${respuestas.length - correctos} errores.`,
          'success',
          4500
        );
      } catch (err) {
        console.error('Error al guardar respuestas:', err);
        DOM.showToast('❌ Error al guardar respuestas: ' + err.message, 'error');
      } finally {
        DOM.hideLoading();
      }
    });
  }

  // 8. FINALIZAR RONDA (DETERMINAR CLASIFICADOS Y ELIMINADOS)
  const btnFinalizarRonda = DOM.get('btnFinalizarRonda');
  if (btnFinalizarRonda) {
    btnFinalizarRonda.addEventListener('click', async () => {
      const state = appState.get();
      if (isHistoricalRoundView(state)) {
        DOM.showToast('Selecciona la ronda activa para finalizarla.', 'warning');
        return;
      }
      const ronda = state.rondaActual || 1;
      const configRonda = CONFIG.ROUNDS[ronda] || { minimoPasar: 2 };
      if (!isRoundComplete()) {
        DOM.showToast('No se puede finalizar: guarda las respuestas de todas las audiciones primero.', 'warning', 4500);
        return;
      }

      const confirmar = window.confirm(
        `¿Desea FINALIZAR la Ronda ${ronda}?\n\n` +
        `• Mínimo exigido: ${configRonda.minimoPasar} aciertos\n` +
        `• Los alumnos con menos de ${configRonda.minimoPasar} aciertos quedarán marcados como ELIMINADOS EN RONDA ${ronda}.\n` +
        `• La ronda quedará marcada como completada y no se avanzará automáticamente.\n` +
        `• El proyector pasará al modo CLASIFICADOS.\n\n` +
        `¿Continuar?`
      );

      if (!confirmar) return;

      DOM.showLoading('Finalizando ronda y calculando clasificación...');
      try {
        const result = await api.finalizarRonda(ronda);
        const data = result.data || {};

        DOM.showToast(
          `Ronda ${ronda} completada: ${data.pasanCount || 0} clasifican, ${data.eliminadosCount || 0} eliminados`,
          'success',
          5000
        );

        const [resNuevos, rankNuevos, alNuevos] = await Promise.all([
          api.getResultados(ronda),
          api.getRanking(),
          api.getAlumnos()
        ]);

        appState.set({
          resultados: resNuevos.data || [],
          ranking: rankNuevos.data || [],
          alumnos: alNuevos.data || [],
          rondaCerrada: true
        });
        CONFIG.COMPLETED_ROUNDS[ronda] = true;
        const selectRonda = DOM.get('selectRonda');
        if (selectRonda) {
          const option = selectRonda.querySelector(`option[value="${ronda}"]`);
          if (option) option.textContent = getRoundOptionLabel(ronda);
        }

        renderAlumnos(appState.get());
        updateAuditionControls();
        renderRoundTimeline();

        actualizarEstiloBotonesProyector(ronda === CONFIG.TOTAL_RONDAS ? 'RANKING_FINAL' : 'CLASIFICADOS', modoBotones);

        const rankingSection = DOM.get('rankingSection');
        if (rankingSection && !rankingSection.classList.contains('hidden')) {
          renderRanking(rankNuevos.data || []);
        }

      } catch (err) {
        console.error('Error al finalizar ronda:', err);
        DOM.showToast('Error al finalizar ronda: ' + err.message, 'error');
      } finally {
        DOM.hideLoading();
      }
    });
  }

  // 9. RESETEAR RONDA
  const btnResetRonda = DOM.get('btnResetRonda');
  if (btnResetRonda) {
    btnResetRonda.addEventListener('click', async () => {
      const state = appState.get();
      if (isHistoricalRoundView(state)) {
        DOM.showToast('Selecciona la ronda activa antes de resetearla.', 'warning');
        return;
      }
      const ronda = state.rondaActual || 1;

      const confirmar = window.confirm(
        `⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${ronda}?\n\n` +
        `Se borrarán las respuestas y resultados de la Ronda ${ronda} y de las rondas posteriores.`
      );

      if (!confirmar) return;

      DOM.showLoading(`Reseteando datos de la Ronda ${ronda}...`);
      try {
        await api.resetRonda(ronda);
        for (let rondaReiniciada = ronda; rondaReiniciada <= CONFIG.TOTAL_RONDAS; rondaReiniciada++) {
          CONFIG.COMPLETED_ROUNDS[rondaReiniciada] = false;
          const selectRonda = DOM.get('selectRonda');
          const option = selectRonda && selectRonda.querySelector(`option[value="${rondaReiniciada}"]`);
          if (option) option.textContent = getRoundOptionLabel(rondaReiniciada);
        }

        const [resNuevos, alNuevos, respuestasNuevas] = await Promise.all([
          api.getResultados(ronda),
          api.getAlumnos(),
          api.getRespuestasRonda(ronda)
        ]);

        appState.set({
          resultados: resNuevos.data || [],
          alumnos: alNuevos.data || [],
          respuestasAudicion: respuestasNuevas.data || [],
          rondaCerrada: false
        });
        actualizarEstiloBotonesProyector('AUDICION', modoBotones);

        renderAlumnos(appState.get());
        updateAuditionControls();
        renderRoundTimeline();
        DOM.showToast(`Ronda ${ronda} ha sido reseteada correctamente`, 'warning');
      } catch (err) {
        console.error('Error al resetear ronda:', err);
        DOM.showToast('Error al resetear ronda: ' + err.message, 'error');
      } finally {
        DOM.hideLoading();
      }
    });
  }

  // 10. VER / OCULTAR RANKING
  const btnVerRanking = DOM.get('btnVerRanking');
  const rankingSection = DOM.get('rankingSection');
  if (btnVerRanking && rankingSection) {
    btnVerRanking.addEventListener('click', async () => {
      const isHidden = rankingSection.classList.contains('hidden');

      if (isHidden) {
        DOM.showLoading('Calculando tabla de posiciones y ranking...');
        try {
          const rankRes = await api.getRanking();
          const ranking = rankRes.data || [];
          appState.set({ ranking });

          renderRanking(ranking);
          rankingSection.classList.remove('hidden');
          btnVerRanking.textContent = '✕ Ocultar Ranking';
          btnVerRanking.classList.replace('bg-purple-700', 'bg-purple-900');

          rankingSection.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
          console.error('Error al obtener ranking:', err);
          DOM.showToast('Error al obtener ranking: ' + err.message, 'error');
        } finally {
          DOM.hideLoading();
        }
      } else {
        rankingSection.classList.add('hidden');
        btnVerRanking.textContent = '🏆 Ver Ranking';
        btnVerRanking.classList.replace('bg-purple-900', 'bg-purple-700');
      }
    });
  }

  updateAuditionControls();
}

// ==========================================
// HELPERS INTERNOS DE AUDIO, AUDITORÍA Y UI
// ==========================================

function actualizarAudicionActualEnApp(num) {
  appState.set({ audicionActual: num });
  renderAudiciones(appState.get());
  renderAlumnos(appState.get());
  const state = appState.get();
  const configRonda = CONFIG.ROUNDS[state.rondaActual] || { duracion: 40 };
  actualizarBadgeRangoUI(0, configRonda.duracion);
}

function isHistoricalRoundView(state = appState.get()) {
  return Number(state.rondaVista || state.rondaActual) !== Number(state.rondaActual);
}

function getRoundViewState(state = appState.get()) {
  if (!isHistoricalRoundView(state)) {
    return { ...state, soloLectura: false };
  }

  const history = state.rondaHistorial;
  if (!history || Number(history.ronda) !== Number(state.rondaVista)) {
    return { ...state, soloLectura: true };
  }

  return {
    ...state,
    rondaActual: Number(history.ronda),
    audicionesRonda: history.audicionesRonda,
    resultados: history.resultados,
    respuestasAudicion: history.respuestasAudicion,
    rondaCerrada: true,
    audicionActual: currentAudicionIndex,
    soloLectura: true
  };
}

function renderRoundView() {
  const state = getRoundViewState();
  renderAudiciones(state);
  renderAlumnos(state);
}

function getParticipantesRonda(state = appState.get()) {
  const ronda = Number(state.rondaActual) || 1;
  return (state.alumnos || []).filter(alumno => {
    const rondaEliminacion = Number(alumno.rondaEliminacion);
    if (Number.isInteger(rondaEliminacion) && rondaEliminacion > 0) {
      return rondaEliminacion >= ronda;
    }
    return !alumno.eliminado;
  });
}

function isCurrentAuditionSaved(state = appState.get()) {
  const participantes = getParticipantesRonda(state);
  return isAuditionSaved(
    state.respuestasAudicion,
    currentAudicionIndex,
    participantes.map(alumno => alumno.id)
  );
}

function isCurrentAuditionDirty(state = appState.get()) {
  const respuestasGuardadas = getResponsesForAudition(
    state.respuestasAudicion,
    currentAudicionIndex
  );
  const cards = [...document.querySelectorAll('[data-alumno-card]')];

  return getParticipantesRonda(state).some(alumno => {
    const card = cards.find(item => item.getAttribute('data-alumno-card') === String(alumno.id));
    if (!card) return false;
    const input = card.querySelector(`.input-pizarra-alumno[data-audicion="${currentAudicionIndex}"]`);
    const checkbox = card.querySelector(`.checkbox-acierto[data-audicion="${currentAudicionIndex}"]`);
    const answer = input ? input.value.trim() : '';
    const correct = Boolean(checkbox && checkbox.checked);
    const saved = respuestasGuardadas.get(String(alumno.id));

    if (!saved) return answer !== '' || correct;
    const savedCorrect = saved.correcto === true || String(saved.correcto).toLowerCase() === 'true';
    return normalizeAnswer(answer) !== normalizeAnswer(saved.respuesta) || correct !== savedCorrect;
  });
}

function isRoundComplete(state = appState.get()) {
  const configRonda = CONFIG.ROUNDS[state.rondaActual];
  if (!configRonda) return false;
  const participantIds = getParticipantesRonda(state).map(alumno => alumno.id);
  if (participantIds.length === 0) return false;
  return Array.from({ length: configRonda.audiciones }, (_, index) => index + 1)
    .every(audicionNum => isAuditionSaved(state.respuestasAudicion, audicionNum, participantIds));
}

function updateAuditionControls() {
  const state = appState.get();
  const historical = isHistoricalRoundView(state);
  const round = historical ? Number(state.rondaVista) : Number(state.rondaActual);
  const configRonda = CONFIG.ROUNDS[round];
  if (!configRonda) return;

  const play = DOM.get('btnPlay');
  const previous = document.getElementById('btn-prev-audicion');
  const next = document.getElementById('btn-next-audicion');
  const save = DOM.get('btnGuardarAciertos');
  const finalize = DOM.get('btnFinalizarRonda');
  const reset = DOM.get('btnResetRonda');
  const status = document.getElementById('audicion-estado-guardado');
  if (historical) {
    if (play) play.disabled = true;
    if (previous) previous.disabled = true;
    if (next) next.disabled = true;
    if (save) save.disabled = true;
    if (finalize) finalize.disabled = true;
    if (reset) reset.disabled = true;
    if (status) {
      status.textContent = `Consulta de Ronda ${round} · solo lectura`;
      status.className = 'text-xs mb-3 text-cyan-300';
    }
    return;
  }

  const saved = isCurrentAuditionSaved(state);
  const dirty = isCurrentAuditionDirty(state);
  const complete = isRoundComplete(state);
  const closed = Boolean(state.rondaCerrada);

  if (play && !isPlaying) play.disabled = closed;
  if (reset) reset.disabled = false;
  if (previous) previous.disabled = closed || isPlaying || currentAudicionIndex <= 1;
  if (next) {
    const canAdvance = !closed && saved && !dirty && !isPlaying && currentAudicionIndex < configRonda.audiciones;
    next.disabled = !canAdvance;
    next.textContent = currentAudicionIndex < configRonda.audiciones
      ? 'Siguiente ▶'
      : 'Última audición';
  }
  if (save) save.disabled = closed || isPlaying || getParticipantesRonda(state).length === 0;
  if (finalize) finalize.disabled = closed || isPlaying || !complete;
  if (status) {
    if (closed) status.textContent = 'Ronda finalizada';
    else if (isPlaying) status.textContent = 'Audio en curso';
    else if (dirty) status.textContent = 'Hay cambios sin guardar';
    else if (saved) status.textContent = `Respuestas de la audición ${currentAudicionIndex} guardadas`;
    else status.textContent = `Audición ${currentAudicionIndex} pendiente de guardar`;
    status.className = `text-xs mb-3 ${closed || (saved && !dirty) ? 'text-emerald-300' : 'text-amber-300'}`;
  }
}

function actualizarBadgeRangoUI(startSec, endSec) {
  const badge = document.getElementById('badge-rango-reproduccion');
  if (badge) {
    badge.textContent = `📍 Rango: de ${startSec}s a ${endSec}s`;
  }
}

function actualizarContadorAciertosAlumno(card, alumnoId) {
  const checkedCount = card.querySelectorAll('.checkbox-acierto:checked').length;
  const countEl = document.getElementById(`aciertos-count-${alumnoId}`);
  if (countEl) countEl.textContent = checkedCount;

  const state = appState.get();
  const configRonda = CONFIG.ROUNDS[state.rondaActual] || { minimoPasar: 2 };
  const badge = card.querySelector('span.rounded-full');
  if (badge && !badge.textContent.includes('Eliminado')) {
    if (checkedCount >= configRonda.minimoPasar) {
      badge.className = 'text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-900/80 text-emerald-200 border border-emerald-500';
      badge.textContent = `Clasificado (${checkedCount})`;
    } else {
      badge.className = 'text-xs px-2.5 py-1 rounded-full font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30';
      badge.textContent = 'En competencia';
    }
  }
}

function actualizarEstiloBotonesProyector(modoActivo, botonesMap) {
  Object.entries(botonesMap).forEach(([modo, btn]) => {
    if (!btn) return;
    if (modo === modoActivo) {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-yellow-500 bg-yellow-500 text-slate-950 cursor-pointer shadow';
    } else {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer';
    }
  });
}

function setProjectorStatus(message) {
  const status = document.getElementById('admin-audio-cache-status');
  if (status) status.textContent = message;
}

function pollProjectorPlayback(commandId) {
  if (projectorCommandId !== commandId) return;

  api.getReproduccionProyector().then(response => {
    const state = response.data;
    if (!state || String(state.commandId) !== commandId) return;

    if (state.stopRequested && ['loading', 'countdown', 'playing'].includes(state.status)) {
      projectorStopPending = true;
      setProjectorStatus('⏳ El proyector está deteniendo la audición...');
    } else if (state.status === 'loading') {
      setProjectorStatus(`⏳ El proyector está cargando la audición ${state.audicionNum}...`);
    } else if (state.status === 'countdown') {
      actualizarInfoReproduccionDesdeProyector(state);
      actualizarBadgeRangoUI(currentPlaybackInfo.startSec, currentPlaybackInfo.endSec);
      setProjectorStatus('✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...');
    } else if (state.status === 'playing') {
      actualizarInfoReproduccionDesdeProyector(state);
      if (!projectorPlaybackStarted) {
        projectorPlaybackStarted = true;
        const startTime = Date.parse(state.startedAt);
        playStartTime = Number.isFinite(startTime) ? new Date(startTime) : new Date();
        actualizarEstadoRegistroInicio();
      }
      setProjectorStatus('🔊 Audición reproduciéndose desde el proyector.');
    } else if (state.status === 'completed') {
      finalizarYRegistrarReproduccion(true, state);
      finalizarEstadoRemoto();
      DOM.showToast(`Audición ${currentAudicionIndex} finalizada. Verifica y guarda las respuestas.`, 'info', 3000);
      updateAuditionControls();
      return;
    } else if (state.status === 'error') {
      finalizarYRegistrarReproduccion(false, state);
      finalizarEstadoRemoto();
      setProjectorStatus(`⚠️ Error en el proyector: ${state.error || 'no se pudo reproducir el audio.'}`);
      DOM.showToast(`Error de reproducción en el proyector: ${state.error || 'audio no disponible.'}`, 'error', 5000);
      return;
    } else if (state.status === 'cancelled') {
      finalizarYRegistrarReproduccion(false, state);
      finalizarEstadoRemoto();
      setProjectorStatus('Audición detenida.');
      updateAuditionControls();
      return;
    }
  }).catch(error => {
    console.warn('[PROYECTOR] No se pudo consultar el estado:', error);
    setProjectorStatus('⚠️ Sin conexión con el proyector; intentando sincronizar...');
  }).finally(() => {
    if (projectorCommandId === commandId) {
      projectorPollTimeout = setTimeout(() => pollProjectorPlayback(commandId), 500);
    }
  });
}

function cancelarReproduccionProyector() {
  const commandId = projectorCommandId;
  if (!commandId || projectorStopPending) return;
  projectorStopPending = true;
  const btn = DOM.get('btnPlay');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Deteniendo en el proyector...';
  }
  setProjectorStatus('⏳ Enviando orden de detención al proyector...');
  api.actualizarReproduccionProyector({ commandId, status: 'stopRequested' })
    .catch(error => {
      console.error('[PROYECTOR] No se pudo solicitar la detención:', error);
      projectorStopPending = false;
      setPlayButtonActive(true);
      DOM.showToast('No se pudo detener la reproducción en el proyector.', 'error', 4500);
    });
}

function finalizarEstadoRemoto() {
  if (projectorPollTimeout) clearTimeout(projectorPollTimeout);
  projectorPollTimeout = null;
  projectorCommandId = null;
  projectorPlaybackStarted = false;
  projectorStopPending = false;
  playStartTime = null;
  resetPlayButtonState();
}

function actualizarInfoReproduccionDesdeProyector(state) {
  const parsedStart = Number(state.startSec);
  const parsedEnd = Number(state.endSec);
  const parsedDuration = Number(state.playedDuration !== undefined ? state.playedDuration : state.duration);
  const startSec = Number.isFinite(parsedStart) ? parsedStart : currentPlaybackInfo.startSec;
  const duration = Number.isFinite(parsedDuration) ? parsedDuration : currentPlaybackInfo.duration;
  currentPlaybackInfo = {
    startSec,
    endSec: Number.isFinite(parsedEnd) ? parsedEnd : startSec + duration,
    duration
  };
}

/**
 * Registra en la base de datos la auditoría exacta de la audición reproducida.
 */
function finalizarYRegistrarReproduccion(completada, estadoProyector) {
  if (estadoProyector && estadoProyector.startedAt && !playStartTime) {
    const startedAt = Date.parse(estadoProyector.startedAt);
    if (Number.isFinite(startedAt)) playStartTime = new Date(startedAt);
  }
  if (!playStartTime && estadoProyector) {
    const playedDuration = Number(estadoProyector.playedDuration);
    const completedAt = Date.parse(estadoProyector.completedAt || '');
    if (Number.isFinite(playedDuration) && playedDuration > 0 && Number.isFinite(completedAt)) {
      playStartTime = new Date(completedAt - playedDuration * 1000);
    }
  }
  if (!playStartTime || !currentPlayingAudData) return;

  const state = appState.get();
  const ronda = state.rondaActual || 1;
  const configRonda = CONFIG.ROUNDS[ronda] || { duracion: 40 };

  actualizarInfoReproduccionDesdeProyector(estadoProyector || {});
  const segIni = currentPlaybackInfo.startSec;
  const segFin = Number.isFinite(Number(currentPlaybackInfo.endSec))
    ? Number(currentPlaybackInfo.endSec)
    : segIni + (completada ? configRonda.duracion : 0);
  const duracionReal = Math.max(0, segFin - segIni);
  const logStatusEl = document.getElementById('admin-log-message');
  const range = document.getElementById('admin-log-range');
  if (range) range.textContent = `de ${segIni}s a ${segFin}s`;
  if (logStatusEl) logStatusEl.textContent = '⏳ Audición finalizada. Guardando registro en la base de datos...';

  api.registrarReproduccion({
    ronda: ronda,
    audicionNum: currentAudicionIndex,
    cancionId: currentPlayingAudData.cancionId || '',
    cancionNombre: currentPlayingAudData.cancionNombre || '',
    cancionCodigo: currentPlayingAudData.cancionCodigo || '',
    segundoInicio: segIni,
    segundoFin: segFin,
    duracion: duracionReal
  }).then(res => {
    console.log('[AUDITORIA] Registrado en la base de datos:', res.data);
    if (logStatusEl && res.data) {
      logStatusEl.textContent = `✅ Registrado en la base de datos: de ${segIni}s a ${segFin}s (${duracionReal}s) a las ${res.data.fechaHora.split(' ')[1]}`;
    }
  }).catch(err => {
    console.warn('[AUDITORIA ERROR]', err);
    if (logStatusEl) logStatusEl.textContent = '⚠️ No se pudo guardar el registro de reproducción en la base de datos.';
  });

  playStartTime = null;
}

function actualizarEstadoRegistroInicio() {
  const logStatusEl = document.getElementById('admin-log-message');
  if (!logStatusEl || !currentPlayingAudData) return;

  const state = appState.get();
  const inicio = Number(currentPlaybackInfo.startSec) || 0;
  const fin = Number(currentPlaybackInfo.endSec) || inicio;
  const hora = new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(playStartTime || new Date());
  const cancion = currentPlayingAudData.cancionNombre || `Composición #${currentPlayingAudData.cancionId}`;
  const range = document.getElementById('admin-log-range');
  if (range) range.textContent = `de ${inicio}s a ${fin}s`;

  logStatusEl.textContent =
    `⏱ Reproducción iniciada: ${cancion} · Ronda ${state.rondaActual || 1}, audición ${currentAudicionIndex} · ` +
    `de ${inicio}s a ${fin}s · ${hora}. Se guardará en la base de datos al finalizar.`;
}

function setPlayButtonLoading(loading) {
  const btn = DOM.get('btnPlay');
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.textContent = '⏳ Cargando audio...';
    btn.className = 'bg-yellow-600 text-white text-xl md:text-2xl px-10 py-4 rounded-xl shadow-lg cursor-not-allowed opacity-80';
  }
}

function setPlayButtonActive(active) {
  const btn = DOM.get('btnPlay');
  if (!btn) return;
  btn.disabled = false;
  if (active) {
    btn.textContent = '⏹ DETENER AUDICIÓN';
    btn.className = 'bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition animate-pulse cursor-pointer';
    document.body.classList.add('is-playing');
  } else {
    resetPlayButtonState();
  }
}

function resetPlayButtonState() {
  isPlaying = false;
  document.body.classList.remove('is-playing');
  const btn = DOM.get('btnPlay');
  if (!btn) return;
  btn.disabled = false;
  btn.textContent = '▶ REPRODUCIR AUDICIÓN';
  btn.className = 'bg-emerald-600 hover:bg-emerald-500 text-white text-xl md:text-2xl font-black px-10 py-4 rounded-xl shadow-xl transition transform active:scale-95 inline-flex items-center space-x-3 cursor-pointer';
}

