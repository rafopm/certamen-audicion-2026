/**
 * Manejo centralizado de eventos de la aplicación.
 * Conecta la UI con los servicios del backend, auditoría y control de proyección.
 */
import { DOM } from './dom.js';
import { appState } from '../core/state.js';
import { api } from '../services/api.js';
import { CONFIG } from '../config.js';
import { getResponsesForAudition, isAuditionSaved } from '../core/rules.js';
import { renderAlumnos, renderAudiciones, renderRanking, renderTimer } from './render.js';
import { isValidRonda, extractDriveId, isValidFileId, normalizeAnswer } from '../utils/validators.js';

let isPlaying = false;
let isRequestingPlayback = false;
let currentAudicionIndex = 1;
let playStartTime = null;
let currentPlayingAudData = null;
let currentPlaybackInfo = { startSec: 0, endSec: 40, duration: 40 };
let projectorCommandId = null;
let projectorPollTimeout = null;
let projectorStartTimeout = null;
let projectorPlaybackStarted = false;

/**
 * Configura todos los event listeners de la aplicación
 * @param {import('../components/audio-player.js').AudioPlayer} player
 */
export function setupEventListeners(player) {
  DOM.init();
  currentAudicionIndex = appState.get().audicionActual || 1;

  // 1. CLICK EN PLAY / DETENER
  const btnPlay = DOM.get('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', async () => {
      if (isPlaying) {
        cancelarReproduccionProyector(player);
        resetPlayButtonState();
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
      const cleanDriveId = extractDriveId(audicionActualData.driveId || audicionActualData.archivoDriveId);
      if (!isValidFileId(cleanDriveId)) {
        DOM.showToast('La canción asignada no tiene un archivo de audio válido en Google Drive.', 'error', 4500);
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
          fileId: cleanDriveId,
          randomStart: isRandomStart
        });
        if (response.data && response.data.status !== 'loading') {
          throw new Error('El proyector no aceptó la orden de reproducción.');
        }

        isPlaying = true;
        setPlayButtonActive(true);
        setProjectorStatus(`⏳ Enviando audición ${currentAudicionIndex} al proyector...`);
        pollProjectorPlayback(commandId, player);
      } catch (error) {
        if (projectorCommandId) {
          try {
            const current = await api.getReproduccionProyector();
            if (current.data && String(current.data.commandId) === projectorCommandId &&
                ['loading', 'countdown', 'playing'].includes(current.data.status)) {
              isPlaying = true;
              setPlayButtonActive(true);
              setProjectorStatus('✅ La orden fue recibida; sincronizando con el proyector...');
              pollProjectorPlayback(projectorCommandId, player);
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

  // Hook al terminar la reproducción en AudioPlayer
  const originalOnComplete = player.onComplete;
  player.onComplete = () => {
    if (projectorPlaybackStarted) {
      finalizarYRegistrarReproduccion(player, true);
      resetPlayButtonState();
      DOM.showToast(`Audición ${currentAudicionIndex} finalizada. Verifica y guarda las respuestas.`, 'info', 3000);
      updateAuditionControls();
    }
    if (originalOnComplete) originalOnComplete();
  };

  // Hook del timer para renderizado visual sincronizado
  if (player.timer) {
    const origTick = player.timer.onTick;
    player.timer.onTick = (timeLeft) => {
      const state = appState.get();
      const configRonda = CONFIG.ROUNDS[state.rondaActual] || { duracion: 40 };
      renderTimer(timeLeft, configRonda.duracion);
      if (origTick) origTick(timeLeft);
    };
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
        actualizarEstiloBotonesProyector(modo, modoBotones);
        DOM.showToast(`Proyector configurado en: ${modo}`, 'info', 2000);
        try {
          await api.actualizarModoProyector(modo);
        } catch (e) {
          console.warn('Error al sincronizar modo proyector:', e);
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
      if (isPlaying) {
        e.target.value = String(stateActual.rondaActual || 1);
        DOM.showToast('Espera a que termine el audio antes de cambiar de ronda.', 'warning');
        return;
      }
      if (nuevaRonda > (stateActual.rondaActual || 1) && !isRoundComplete()) {
        e.target.value = String(stateActual.rondaActual || 1);
        DOM.showToast('Guarda todas las respuestas de la ronda actual antes de avanzar.', 'warning', 4000);
        return;
      }

      DOM.showLoading(`Cargando Ronda ${nuevaRonda}...`);
      try {
        currentAudicionIndex = 1;

        await api.actualizarRondaActual(nuevaRonda);

        const [audRes, resRes, alRes, respuestasRes, estadoRes] = await Promise.all([
          api.getAudicionesRonda(nuevaRonda),
          api.getResultados(nuevaRonda),
          api.getAlumnos(),
          api.getRespuestasRonda(nuevaRonda),
          api.getEstadoCertamen()
        ]);

        appState.set({
          rondaActual: nuevaRonda,
          rondaCerrada: Boolean(estadoRes.data && estadoRes.data.rondaCerrada),
          audicionActual: 1,
          audicionesRonda: audRes.data || [],
          resultados: resRes.data || [],
          alumnos: alRes.data || [],
          respuestasAudicion: respuestasRes.data || []
        });

        renderAudiciones(appState.get());
        renderAlumnos(appState.get());

        const configRonda = CONFIG.ROUNDS[nuevaRonda] || { duracion: 40 };
        renderTimer(configRonda.duracion, configRonda.duracion);
        actualizarBadgeRangoUI(0, configRonda.duracion);
        updateAuditionControls();
        DOM.showToast(`Secuencia: Ronda ${nuevaRonda} activada`, 'success');
      } catch (err) {
        console.error('Error al cambiar ronda:', err);
        e.target.value = String(stateActual.rondaActual || 1);
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
        `• El proyector pasará automáticamente al modo CLASIFICADOS.\n\n` +
        `¿Continuar?`
      );

      if (!confirmar) return;

      DOM.showLoading('Finalizando ronda y calculando clasificación...');
      try {
        const result = await api.finalizarRonda(ronda);
        const data = result.data || {};

        DOM.showToast(
          `Ronda ${ronda} Finalizada: ${data.pasanCount || 0} clasifican, ${data.eliminadosCount || 0} eliminados`,
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

        renderAlumnos(appState.get());

        actualizarEstiloBotonesProyector(ronda === CONFIG.TOTAL_RONDAS ? 'RANKING_FINAL' : 'CLASIFICADOS', modoBotones);

        const rankingSection = DOM.get('rankingSection');
        if (rankingSection && !rankingSection.classList.contains('hidden')) {
          renderRanking(rankNuevos.data || []);
        }

        if (data.siguienteRonda && data.siguienteRonda !== ronda && data.siguienteRonda <= CONFIG.TOTAL_RONDAS) {
          const select = DOM.get('selectRonda');
          if (select) {
            select.value = String(data.siguienteRonda);
            select.dispatchEvent(new Event('change'));
          }
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
      const ronda = state.rondaActual || 1;

      const confirmar = window.confirm(
        `⚠️ ATENCIÓN: ¿Está seguro de RESETEAR la Ronda ${ronda}?\n\n` +
        `Se borrarán las respuestas y resultados de la Ronda ${ronda} y de las rondas posteriores.`
      );

      if (!confirmar) return;

      DOM.showLoading(`Reseteando datos de la Ronda ${ronda}...`);
      try {
        await api.resetRonda(ronda);

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

        renderAlumnos(appState.get());
        updateAuditionControls();
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
  const configRonda = CONFIG.ROUNDS[state.rondaActual];
  if (!configRonda) return;

  const saved = isCurrentAuditionSaved(state);
  const dirty = isCurrentAuditionDirty(state);
  const complete = isRoundComplete(state);
  const closed = Boolean(state.rondaCerrada);
  const previous = document.getElementById('btn-prev-audicion');
  const next = document.getElementById('btn-next-audicion');
  const save = DOM.get('btnGuardarAciertos');
  const finalize = DOM.get('btnFinalizarRonda');
  const status = document.getElementById('audicion-estado-guardado');

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

function pollProjectorPlayback(commandId, player) {
  if (projectorCommandId !== commandId) return;

  const requestStartedAt = Date.now();
  api.getReproduccionProyector().then(response => {
    const responseReceivedAt = Date.now();
    const state = response.data;
    if (!state || String(state.commandId) !== commandId) return;
    const serverNow = Date.parse(state.serverNow);
    const serverOffsetMs = Number.isFinite(serverNow)
      ? serverNow - (requestStartedAt + responseReceivedAt) / 2
      : 0;

    if (state.status === 'loading') {
      setProjectorStatus(`⏳ El proyector está cargando la audición ${state.audicionNum}...`);
    } else if (state.status === 'countdown') {
      currentPlaybackInfo = {
        startSec: Number(state.startSec) || 0,
        endSec: Number(state.endSec) || Number(state.startSec) + Number(state.duration),
        duration: Number(state.duration)
      };
      actualizarBadgeRangoUI(currentPlaybackInfo.startSec, currentPlaybackInfo.endSec);
      setProjectorStatus('✅ Archivo cargado en el proyector. Cuenta regresiva de 5 segundos...');
      if (!projectorStartTimeout) {
        const startAt = Date.parse(state.startAt);
        if (!Number.isFinite(startAt)) {
          setProjectorStatus('⚠️ El servidor devolvió una hora de inicio inválida.');
          api.actualizarReproduccionProyector({
            commandId,
            status: 'error',
            error: 'Hora de inicio inválida.'
          }).catch(error => console.error('[PROYECTOR] No se pudo reportar el error:', error));
          return;
        }
        const delay = Math.max(0, startAt - Date.now() - serverOffsetMs);
        projectorStartTimeout = setTimeout(() => {
          projectorStartTimeout = null;
          if (projectorCommandId !== commandId || !isPlaying) return;
          projectorPlaybackStarted = true;
          playStartTime = new Date();
          player.timer.start(Number(state.duration));
          actualizarEstadoRegistroInicio();
          setProjectorStatus('🔊 Audición reproduciéndose desde el proyector.');
        }, delay);
      }
    } else if (state.status === 'playing') {
      setProjectorStatus('🔊 Audición reproduciéndose desde el proyector.');
    } else if (state.status === 'completed') {
      if (projectorPlaybackStarted && playStartTime) {
        player.timer.stop();
        finalizarYRegistrarReproduccion(player, true);
      }
      finalizarEstadoRemoto(player);
      DOM.showToast(`Audición ${currentAudicionIndex} finalizada. Verifica y guarda las respuestas.`, 'info', 3000);
      updateAuditionControls();
      return;
    } else if (state.status === 'error') {
      if (projectorPlaybackStarted && playStartTime) {
        player.timer.stop();
        finalizarYRegistrarReproduccion(player, false);
      }
      finalizarEstadoRemoto(player);
      setProjectorStatus(`⚠️ Error en el proyector: ${state.error || 'no se pudo reproducir el audio.'}`);
      DOM.showToast(`Error de reproducción en el proyector: ${state.error || 'audio no disponible.'}`, 'error', 5000);
      return;
    } else if (state.status === 'cancelled') {
      finalizarEstadoRemoto(player);
      setProjectorStatus('Audición detenida.');
      return;
    }
  }).catch(error => {
    console.warn('[PROYECTOR] No se pudo consultar el estado:', error);
    setProjectorStatus('⚠️ Sin conexión con el proyector; intentando sincronizar...');
  }).finally(() => {
    if (projectorCommandId === commandId) {
      projectorPollTimeout = setTimeout(() => pollProjectorPlayback(commandId, player), 1000);
    }
  });
}

function cancelarReproduccionProyector(player) {
  const commandId = projectorCommandId;
  if (projectorPlaybackStarted && playStartTime) {
    finalizarYRegistrarReproduccion(player, false);
  }
  player.timer.stop();
  if (projectorStartTimeout) clearTimeout(projectorStartTimeout);
  if (projectorPollTimeout) clearTimeout(projectorPollTimeout);
  projectorStartTimeout = null;
  projectorPollTimeout = null;
  projectorCommandId = null;
  projectorPlaybackStarted = false;
  playStartTime = null;
  if (commandId) {
    api.actualizarReproduccionProyector({ commandId, status: 'cancelled' })
      .catch(error => console.error('[PROYECTOR] No se pudo detener la reproducción:', error));
  }
  setProjectorStatus('Audición detenida.');
}

function finalizarEstadoRemoto(player) {
  player.timer.stop();
  if (projectorStartTimeout) clearTimeout(projectorStartTimeout);
  if (projectorPollTimeout) clearTimeout(projectorPollTimeout);
  projectorStartTimeout = null;
  projectorPollTimeout = null;
  projectorCommandId = null;
  projectorPlaybackStarted = false;
  playStartTime = null;
  resetPlayButtonState();
}

/**
 * Registra en Google Sheets la auditoría exacta de la audición reproducida con su rango real de segundos
 */
function finalizarYRegistrarReproduccion(player, completada) {
  if (!playStartTime || !currentPlayingAudData) return;

  const state = appState.get();
  const ronda = state.rondaActual || 1;
  const configRonda = CONFIG.ROUNDS[ronda] || { duracion: 40 };

  const segIni = (currentPlaybackInfo && currentPlaybackInfo.startSec !== undefined)
    ? currentPlaybackInfo.startSec
    : 0;

  let segFin = (currentPlaybackInfo && currentPlaybackInfo.endSec !== undefined)
    ? currentPlaybackInfo.endSec
    : (segIni + configRonda.duracion);

  if (!completada && player.timer && player.timer.timeLeft !== undefined) {
    const elapsed = configRonda.duracion - player.timer.timeLeft;
    segFin = segIni + Math.max(1, elapsed);
  }

  const duracionReal = Math.max(1, segFin - segIni);
  const logStatusEl = document.getElementById('admin-log-message');
  if (logStatusEl) logStatusEl.textContent = '⏳ Audición finalizada. Guardando registro en Google Sheets...';

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
    console.log('[AUDITORIA] Registrado en Google Sheets:', res.data);
    if (logStatusEl && res.data) {
      logStatusEl.textContent = `✅ Registrado en Google Sheets: de ${segIni}s a ${segFin}s (${duracionReal}s) a las ${res.data.fechaHora.split(' ')[1]}`;
    }
  }).catch(err => {
    console.warn('[AUDITORIA ERROR]', err);
    if (logStatusEl) logStatusEl.textContent = '⚠️ No se pudo guardar el registro de reproducción en Google Sheets.';
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

  logStatusEl.textContent =
    `⏱ Reproducción iniciada: ${cancion} · Ronda ${state.rondaActual || 1}, audición ${currentAudicionIndex} · ` +
    `de ${inicio}s a ${fin}s · ${hora}. Se guardará en Google Sheets al finalizar.`;
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

