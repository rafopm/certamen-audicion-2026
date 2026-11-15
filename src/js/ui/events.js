/**
 * Manejo centralizado de eventos de la aplicación.
 * Conecta la UI con los servicios del backend, auditoría y control de proyección.
 */
import { DOM } from './dom.js';
import { appState } from '../core/state.js';
import { api } from '../services/api.js';
import { CONFIG } from '../config.js';
import { renderAlumnos, renderAudiciones, renderRanking, renderTimer } from './render.js';
import { isValidRonda, extractDriveId, isValidFileId } from '../utils/validators.js';

let isPlaying = false;
let currentAudicionIndex = 1;
let playStartTime = null;
let currentPlayingAudData = null;
let currentPlaybackInfo = { startSec: 0, endSec: 40, duration: 40 };

// Caché en memoria para los data URIs de audios
const audioDataUriCache = {};

function normalizeAudioDataUri(dataUri) {
  if (!dataUri || typeof dataUri !== 'string') return '';
  if (
    dataUri.startsWith('data:video/') ||
    dataUri.startsWith('data:application/octet-stream') ||
    dataUri.startsWith('data:binary/')
  ) {
    return dataUri.replace(/^data:[^;]+;base64,/, 'data:audio/mpeg;base64,');
  }
  return dataUri;
}

/**
 * Configura todos los event listeners de la aplicación
 * @param {import('../components/audio-player.js').AudioPlayer} player
 */
export function setupEventListeners(player) {
  DOM.init();

  // 1. CLICK EN PLAY / DETENER
  const btnPlay = DOM.get('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', async () => {
      if (isPlaying) {
        finalizarYRegistrarReproduccion(player, false);
        player.stop();
        resetPlayButtonState();
        return;
      }

      const state = appState.get();
      const ronda = state.rondaActual || 1;
      const configRonda = CONFIG.ROUNDS[ronda] || { duracion: 40, audiciones: 4 };

      // Obtener o cargar audiciones de la ronda si aún no están en memoria
      let audiciones = state.audicionesRonda || [];
      if (!audiciones || audiciones.length === 0) {
        DOM.showLoading('Obteniendo audición configurada...');
        try {
          const audRes = await api.getAudicionesRonda(ronda);
          audiciones = audRes.data || [];
          appState.set({ audicionesRonda: audiciones });
        } catch (err) {
          console.warn('[AUDIO] No se pudieron cargar audiciones desde backend:', err);
        } finally {
          DOM.hideLoading();
        }
      }

      // Buscar audición actual
      const audicionActualData = audiciones.find(a => a.audicionNum === currentAudicionIndex) || audiciones[currentAudicionIndex - 1] || {};
      currentPlayingAudData = audicionActualData;
      const rawDriveId = audicionActualData.driveId || audicionActualData.archivoDriveId || null;
      const cleanDriveId = extractDriveId(rawDriveId);
      const duracion = configRonda.duracion;

      // Verificar si el jurado activó inicio en segundo aleatorio
      const chkRandom = document.getElementById('chk-random-start');
      const isRandomStart = chkRandom ? chkRandom.checked : true;

      setPlayButtonLoading(true);

      try {
        let reproduccionExitosa = false;
        playStartTime = new Date();

        // Caso 1: URL directa personalizada
        if (rawDriveId && (rawDriveId.startsWith('http://') || rawDriveId.startsWith('https://') || rawDriveId.startsWith('/')) && !rawDriveId.includes('drive.google.com')) {
          try {
            console.log(`[AUDIO] Reproduciendo URL directa: ${rawDriveId}`);
            const playInfo = await tryPlayAudio(player, rawDriveId, duracion, { randomStart: isRandomStart });
            currentPlaybackInfo = playInfo || { startSec: 0, endSec: duracion, duration };
            actualizarBadgeRangoUI(currentPlaybackInfo.startSec, currentPlaybackInfo.endSec);
            reproduccionExitosa = true;
          } catch (e) {
            console.warn('[AUDIO] Falló URL directa personalizada:', e);
          }
        }

        // Caso 2: Audio de Google Drive vía Backend Apps Script (Base64 normalizado)
        if (!reproduccionExitosa && isValidFileId(cleanDriveId)) {
          let dataUri = audioDataUriCache[cleanDriveId];

          if (!dataUri) {
            DOM.showLoading('Cargando pista de audio desde Google Drive...');
            try {
              const b64Res = await api.getAudioUrl(cleanDriveId, true);
              if (b64Res && b64Res.data && b64Res.data.dataUri) {
                dataUri = normalizeAudioDataUri(b64Res.data.dataUri);
                audioDataUriCache[cleanDriveId] = dataUri;
              }
            } catch (errApi) {
              console.warn('[AUDIO] Error al consultar API de audio:', errApi);
            } finally {
              DOM.hideLoading();
            }
          }

          if (dataUri) {
            try {
              const playInfo = await tryPlayAudio(player, dataUri, duracion, { randomStart: isRandomStart });
              currentPlaybackInfo = playInfo || { startSec: 0, endSec: duracion, duration };
              actualizarBadgeRangoUI(currentPlaybackInfo.startSec, currentPlaybackInfo.endSec);
              reproduccionExitosa = true;
            } catch (errPlayDataUri) {
              console.warn('[AUDIO] Error al reproducir Data URI:', errPlayDataUri);
            }
          }
        }

        // Caso 3: Fallback de seguridad infalible (acorde musical de Strauss con simulación de rango)
        if (!reproduccionExitosa) {
          const simStart = isRandomStart ? Math.floor(Math.random() * 40) : 0;
          const simEnd = simStart + duracion;
          currentPlaybackInfo = { startSec: simStart, endSec: simEnd, duration };
          actualizarBadgeRangoUI(simStart, simEnd);

          DOM.showToast(
            `Audición ${currentAudicionIndex}: ${!cleanDriveId ? 'Archivo no asignado' : 'Reproduciendo sonido de prueba'} (de ${simStart}s a ${simEnd}s).`,
            'info',
            3500
          );
          playSyntheticTone(player, duracion);
        }

        isPlaying = true;
        setPlayButtonActive(true);

      } catch (playError) {
        console.error('[AUDIO ERROR GENERAL]', playError);
        const simStart = isRandomStart ? Math.floor(Math.random() * 30) : 0;
        currentPlaybackInfo = { startSec: simStart, endSec: simStart + duracion, duration };
        actualizarBadgeRangoUI(simStart, simStart + duracion);
        playSyntheticTone(player, duracion);
        isPlaying = true;
        setPlayButtonActive(true);
      } finally {
        setPlayButtonLoading(false);
      }
    });
  }

  // Hook al terminar la reproducción en AudioPlayer
  const originalOnComplete = player.onComplete;
  player.onComplete = () => {
    finalizarYRegistrarReproduccion(player, true);
    resetPlayButtonState();
    DOM.showToast(`Audición ${currentAudicionIndex} finalizada y registrada`, 'info', 2500);

    const state = appState.get();
    const configRonda = CONFIG.ROUNDS[state.rondaActual] || { audiciones: 4 };
    if (currentAudicionIndex < configRonda.audiciones) {
      currentAudicionIndex++;
      actualizarAudicionActualEnApp(currentAudicionIndex);
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
        currentAudicionIndex--;
        actualizarAudicionActualEnApp(currentAudicionIndex);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const state = appState.get();
      const configRonda = CONFIG.ROUNDS[state.rondaActual] || { audiciones: 4 };
      if (currentAudicionIndex < configRonda.audiciones) {
        currentAudicionIndex++;
        actualizarAudicionActualEnApp(currentAudicionIndex);
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

      DOM.showLoading(`Cargando Ronda ${nuevaRonda}...`);
      try {
        currentAudicionIndex = 1;

        api.actualizarRondaActual(nuevaRonda).catch(err => console.warn('Aviso backend ronda:', err));

        const [audRes, resRes, alRes] = await Promise.all([
          api.getAudicionesRonda(nuevaRonda).catch(() => ({ data: [] })),
          api.getResultados(nuevaRonda).catch(() => ({ data: [] })),
          api.getAlumnos().catch(() => ({ data: [] }))
        ]);

        appState.set({
          rondaActual: nuevaRonda,
          audicionActual: 1,
          audicionesRonda: audRes.data || [],
          resultados: resRes.data || [],
          alumnos: alRes.data || []
        });

        renderAudiciones(appState.get());
        renderAlumnos(appState.get());

        const configRonda = CONFIG.ROUNDS[nuevaRonda] || { duracion: 40 };
        renderTimer(configRonda.duracion, configRonda.duracion);
        actualizarBadgeRangoUI(0, configRonda.duracion);

        DOM.showToast(`Secuencia: Ronda ${nuevaRonda} activada`, 'success');
      } catch (err) {
        console.error('Error al cambiar ronda:', err);
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
        const codigoEsperado = (audData.cancionCodigo || '').toUpperCase();
        const nombreEsperado = (audData.cancionNombre || '').toUpperCase();

        const card = document.querySelector(`[data-alumno-card="${alumnoId}"]`);
        if (!card) return;

        const checkboxActual = card.querySelector(`.checkbox-acierto[data-audicion="${currentAudicionIndex}"]`);

        if (codigoEsperado && (valorEscrito === codigoEsperado || (valorEscrito.length >= 3 && nombreEsperado.includes(valorEscrito)))) {
          e.target.classList.remove('border-slate-700', 'border-rose-500');
          e.target.classList.add('border-emerald-400', 'bg-emerald-950/60');
          if (checkboxActual && !checkboxActual.checked) {
            checkboxActual.checked = true;
            actualizarContadorAciertosAlumno(card, alumnoId);
          }
        } else if (valorEscrito === '') {
          e.target.classList.remove('border-emerald-400', 'bg-emerald-950/60', 'border-rose-500');
          e.target.classList.add('border-slate-700');
        } else {
          e.target.classList.remove('border-emerald-400', 'bg-emerald-950/60');
          e.target.classList.add('border-slate-700');
        }
      }
    });

    listaAlumnos.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('checkbox-acierto')) {
        const alumnoId = e.target.dataset.alumnoId;
        const card = document.querySelector(`[data-alumno-card="${alumnoId}"]`);
        if (card) {
          actualizarContadorAciertosAlumno(card, alumnoId);
        }
      }
    });
  }

  // 6. BOTÓN RÁPIDO "MARCAR TODOS"
  const btnMarcarTodos = document.getElementById('btn-marcar-todos');
  if (btnMarcarTodos) {
    btnMarcarTodos.addEventListener('click', () => {
      const activeCards = document.querySelectorAll('[data-alumno-card]:not(.opacity-40)');
      let count = 0;
      activeCards.forEach(card => {
        const cb = card.querySelector(`.checkbox-acierto[data-audicion="${currentAudicionIndex}"]`);
        if (cb && !cb.disabled) {
          cb.checked = true;
          const alumnoId = card.getAttribute('data-alumno-card');
          actualizarContadorAciertosAlumno(card, alumnoId);
          count++;
        }
      });
      DOM.showToast(`Acierto marcado para ${count} alumnos en Audición ${currentAudicionIndex}`, 'info', 2000);
    });
  }

  // 7. GUARDAR ACIERTOS EN GOOGLE SHEETS
  const btnGuardarAciertos = DOM.get('btnGuardarAciertos');
  if (btnGuardarAciertos) {
    btnGuardarAciertos.addEventListener('click', async () => {
      const state = appState.get();
      const ronda = state.rondaActual || 1;

      const cards = document.querySelectorAll('[data-alumno-card]');
      const aciertosMap = {};

      cards.forEach(card => {
        const alumnoId = card.getAttribute('data-alumno-card');
        const checked = card.querySelectorAll('.checkbox-acierto:checked').length;
        aciertosMap[alumnoId] = checked;
      });

      DOM.showLoading('Guardando aciertos en Google Sheets...');
      try {
        await api.guardarAciertosLote({
          ronda: ronda,
          aciertos: aciertosMap
        });

        const resActualizados = await api.getResultados(ronda);
        appState.set({ resultados: resActualizados.data || [] });
        renderAlumnos(appState.get());

        DOM.showToast('✅ Aciertos guardados exitosamente en la nube', 'success');
      } catch (err) {
        console.error('Error al guardar aciertos:', err);
        DOM.showToast('❌ Error al guardar aciertos: ' + err.message, 'error');
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
          alumnos: alNuevos.data || []
        });

        renderAlumnos(appState.get());

        actualizarEstiloBotonesProyector(ronda === 5 ? 'RANKING_FINAL' : 'CLASIFICADOS', modoBotones);

        const rankingSection = DOM.get('rankingSection');
        if (rankingSection && !rankingSection.classList.contains('hidden')) {
          renderRanking(rankNuevos.data || []);
        }

        if (data.siguienteRonda && data.siguienteRonda !== ronda && data.siguienteRonda <= 5) {
          const avanzar = window.confirm(`¿Desea avanzar a la Ronda ${data.siguienteRonda}?`);
          if (avanzar) {
            const select = DOM.get('selectRonda');
            if (select) {
              select.value = String(data.siguienteRonda);
              select.dispatchEvent(new Event('change'));
            }
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
        `Esta acción borrará todos los aciertos registrados para esta ronda en Google Sheets.`
      );

      if (!confirmar) return;

      DOM.showLoading(`Reseteando datos de la Ronda ${ronda}...`);
      try {
        await api.resetRonda(ronda);

        const [resNuevos, alNuevos] = await Promise.all([
          api.getResultados(ronda),
          api.getAlumnos()
        ]);

        appState.set({
          resultados: resNuevos.data || [],
          alumnos: alNuevos.data || []
        });

        renderAlumnos(appState.get());
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
    const logStatusEl = document.getElementById('admin-log-status');
    if (logStatusEl && res.data) {
      logStatusEl.innerHTML = `✅ Registrado en Google Sheets: de ${segIni}s a ${segFin}s (${duracionReal}s) a las ${res.data.fechaHora.split(' ')[1]}`;
    }
  }).catch(err => {
    console.warn('[AUDITORIA ERROR]', err);
  });

  playStartTime = null;
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

async function tryPlayAudio(player, url, duration, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Tiempo de espera agotado al reproducir fuente de audio'));
    }, 8000);

    player.play(url, duration, options)
      .then((playInfo) => {
        clearTimeout(timeout);
        resolve(playInfo);
      })
      .catch(err => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

function playSyntheticTone(player, duration) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('No Web Audio API');
    const ctx = new AudioCtx();

    const frequencies = [293.66, 369.99, 440.00];
    const oscillators = [];

    frequencies.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillators.push(osc);
    });

    player.timer.start(duration);

    setTimeout(() => {
      try {
        oscillators.forEach(osc => osc.stop());
        ctx.close();
      } catch (e) {}
    }, duration * 1000);

  } catch (e) {
    player.timer.start(duration);
  }
}
