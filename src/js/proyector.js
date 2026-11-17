/**
 * Script de la Vista de Proyector (Pantalla Grande).
 * Sincronización continua cada 2s con el servicio de datos.
 * Soporta los 3 modos oficiales:
 * 1. 'AUDICION': Solo temporizador gigante y foco musical (sin ranking público).
 * 2. 'CLASIFICADOS': Muestra únicamente a los clasificados al concluir cada ronda.
 * 3. 'RANKING_FINAL': Revela el podio con coronas, tabla completa y confeti al finalizar.
 */
import { api } from './services/api.js';
import { preloadAudio } from './services/audio-service.js';
import { CONFIG } from './config.js';
import { formatNombre, formatRanking } from './utils/formatters.js';

let lastRonda = null;
let lastModo = null;
let confettiTriggered = false;
let audioActivated = false;
let hasProjectorControl = false;
let projectorControlLockPending = false;
let releaseProjectorControlLock = null;
let activePlaybackCommandId = null;
const handledPlaybackCommandIds = new Set();
let playAttemptCommandId = null;
let playbackInterval = null;
let playbackStopTimeout = null;
let countdownInterval = null;
let playbackSyncTimeout = null;
let completionRetryTimeout = null;
let activationWaiters = [];
let completionSent = false;
let playbackStarting = false;
let stopRequestHandled = false;
let playbackStartedAt = null;
let playbackDuration = 0;
let playbackStateConfirmed = false;
let playbackStatePromise = Promise.resolve();

// Elementos DOM
const elRondaNombre = document.getElementById('proj-ronda-nombre');
const elRondaDetalle = document.getElementById('proj-ronda-detalle');
const elTimer = document.getElementById('proj-timer');
const elLiveIndicator = document.getElementById('proj-live-status');
const elAudio = document.getElementById('proj-audio');
const elAudioStatus = document.getElementById('proj-audio-status');
const btnActivateAudio = document.getElementById('btn-audio-activate');

// Vistas
const viewAudicion = document.getElementById('view-modo-audicion');
const viewClasificados = document.getElementById('view-modo-clasificados');
const viewRanking = document.getElementById('view-modo-ranking');

const elClasificadosGrid = document.getElementById('proj-clasificados-grid');
const elClasificadosSub = document.getElementById('proj-clasificados-subtitulo');
const elPodio = document.getElementById('proj-podio');
const elRankingTable = document.getElementById('proj-ranking-table');

/**
 * Inicialización
 */
async function initProyector() {
  console.log('[PROYECTOR] Inicializando pantalla de auditorio...');
  updateProyector();
  setInterval(updateProyector, 2000);

  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullScreen);
  }

  if (btnActivateAudio) {
    btnActivateAudio.addEventListener('click', async () => {
      if (projectorControlLockPending || audioActivated) return;
      projectorControlLockPending = true;
      btnActivateAudio.disabled = true;
      btnActivateAudio.textContent = '⏳ Activando audio...';
      try {
        hasProjectorControl = await adquirirControlProyector();
        if (!hasProjectorControl) {
          btnActivateAudio.disabled = false;
          btnActivateAudio.textContent = '🔊 Activar audio';
          setAudioStatus('Esta audición ya está controlada por otra ventana del proyector.');
          return;
        }
        await desbloquearAudio();
        audioActivated = true;
        btnActivateAudio.textContent = '🔊 Audio activado';
        btnActivateAudio.disabled = true;
        btnActivateAudio.classList.add('opacity-60', 'cursor-default');
        resolveActivationWaiters(true);
        setAudioStatus('Audio del proyector activado; esperando la audición del jurado.');
      } catch (error) {
        liberarControlProyector();
        hasProjectorControl = false;
        btnActivateAudio.disabled = false;
        btnActivateAudio.textContent = '🔊 Activar audio';
        console.error('[PROYECTOR] El navegador no permitió activar el audio:', error);
        setAudioStatus('⚠️ No se pudo activar el audio. Vuelve a pulsar el botón e inténtalo otra vez.');
      } finally {
        projectorControlLockPending = false;
      }
    });
  }
}

/**
 * Ciclo de consulta y sincronización en tiempo real
 */
async function updateProyector() {
  try {
    const estadoRes = await api.getEstadoCertamen().catch(() => null);

    if (estadoRes && estadoRes.data) {
      const estado = estadoRes.data;
      renderEstado(estado);
      sincronizarReproduccion(estado.reproduccionProyector);

      // Sincronizar modo visual
      const modoSolicitado = estado.modoProyector || 'AUDICION';
      const modo = modoSolicitado === 'CLASIFICADOS' && !estado.rondaCerrada
        ? 'AUDICION'
        : modoSolicitado === 'RANKING_FINAL' && !estado.certamenFinalizado
          ? 'AUDICION'
          : modoSolicitado;
      aplicarModoVisual(modo, estado);

      if (elLiveIndicator) {
        elLiveIndicator.innerHTML = '<span class="inline-block w-3 h-3 bg-emerald-500 rounded-full animate-ping mr-2"></span> EN VIVO';
      }
    }

  } catch (error) {
    console.warn('[PROYECTOR] Error en sincronización:', error);
    if (elLiveIndicator) {
      elLiveIndicator.innerHTML = '<span class="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span> CONECTANDO...';
    }
  }
}

function sincronizarReproduccion(estado) {
  if (!estado || !estado.commandId) return;

  const commandId = String(estado.commandId);
  if (estado.status === 'loading') {
    if (activePlaybackCommandId !== commandId) {
      if (!hasProjectorControl) {
        setAudioStatus('Activa el audio en esta ventana para controlar la reproducción.');
        return;
      }
      if (handledPlaybackCommandIds.has(commandId)) return;
      handledPlaybackCommandIds.add(commandId);
      activePlaybackCommandId = commandId;
      completionSent = false;
      stopRequestHandled = false;
      iniciarConsultaReproduccion();
      prepararReproduccion(estado).catch(error => {
        console.error('[PROYECTOR] No se pudo preparar la pista:', error);
        marcarErrorReproduccion(commandId, error);
      });
    }
  }

  if (commandId !== activePlaybackCommandId) return;
  if (estado.stopRequested && ['loading', 'countdown', 'playing'].includes(estado.status)) {
    detenerReproduccionPorOrden(commandId);
    return;
  }
  if (estado.status === 'loading') return;

  if (estado.status === 'countdown' && !countdownInterval && !playbackStarting && !playbackInterval) {
    iniciarCuentaRegresiva(estado);
  } else if (estado.status === 'cancelled' || estado.status === 'error' || estado.status === 'completed') {
    limpiarReproduccion();
    if (estado.status === 'cancelled') setAudioStatus('Audición detenida desde el panel del jurado.');
    if (estado.status === 'error') setAudioStatus(`Error de audio: ${estado.error || 'no se pudo reproducir la pista.'}`);
    if (estado.status === 'completed') setAudioStatus('Audición finalizada.');
  }
}

async function prepararReproduccion(estado) {
  const commandId = String(estado.commandId);
  setAudioStatus(`⏳ Cargando archivo para la audición ${estado.audicionNum}...`);
  try {
    const audioUrl = await preloadAudio(estado.fileId);
    if (activePlaybackCommandId !== commandId || stopRequestHandled) return;

    await cargarAudioEnElemento(audioUrl);
    setAudioStatus('Pista cargada. Activa el audio en esta computadora para continuar.');
    const activated = await esperarActivacionAudio();
    if (!activated || activePlaybackCommandId !== commandId || stopRequestHandled) return;

    const current = await api.getReproduccionProyector();
    if (!current.data || String(current.data.commandId) !== commandId || current.data.status !== 'loading') {
      limpiarReproduccion();
      return;
    }

    const duration = Number(estado.duration);
    const totalDuration = Number(elAudio.duration);
    if (!Number.isFinite(duration) || duration < 1 ||
        !Number.isFinite(totalDuration) || totalDuration < duration) {
      throw new Error('La pista no tiene duración suficiente para esta audición.');
    }
    const maxStart = Number.isFinite(totalDuration) && totalDuration > duration
      ? Math.floor(totalDuration - duration)
      : 0;
    const startSec = estado.randomStart && maxStart > 0
      ? Math.floor(Math.random() * (maxStart + 1))
      : 0;
    await posicionarAudio(startSec);
    if (activePlaybackCommandId !== commandId || stopRequestHandled) return;
    const response = await api.actualizarReproduccionProyector({
      commandId,
      status: 'countdown',
      startSec
    });
    if (activePlaybackCommandId === commandId && response.data) {
      iniciarCuentaRegresiva(response.data);
    }
  } catch (error) {
    if (activePlaybackCommandId === commandId) throw error;
  }
}

function posicionarAudio(startSec) {
  if (!elAudio || startSec <= 0 || Math.abs(elAudio.currentTime - startSec) < 0.05) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('No se pudo posicionar la pista en el segundo seleccionado.'));
    }, 10000);
    const cleanup = () => {
      clearTimeout(timeout);
      elAudio.removeEventListener('seeked', onSeeked);
      elAudio.removeEventListener('error', onError);
    };
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Error al posicionar la pista de audio.'));
    };

    elAudio.addEventListener('seeked', onSeeked, { once: true });
    elAudio.addEventListener('error', onError, { once: true });
    try {
      elAudio.currentTime = startSec;
      if (!elAudio.seeking && Math.abs(elAudio.currentTime - startSec) < 0.05) onSeeked();
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

function cargarAudioEnElemento(audioUrl) {
  return new Promise((resolve, reject) => {
    if (!elAudio) {
      reject(new Error('No se encontró el reproductor de audio del proyector.'));
      return;
    }
    if (elAudio.readyState >= 2 && elAudio.src === audioUrl) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Se agotó el tiempo de espera al cargar el audio.'));
    }, 30000);
    const cleanup = () => {
      clearTimeout(timeout);
      elAudio.removeEventListener('canplay', onReady);
      elAudio.removeEventListener('error', onError);
    };
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('El navegador no pudo decodificar el archivo de audio.'));
    };

    elAudio.addEventListener('canplay', onReady, { once: true });
    elAudio.addEventListener('error', onError, { once: true });
    elAudio.src = audioUrl;
    elAudio.load();
    if (elAudio.readyState >= 2) onReady();
  });
}

function esperarActivacionAudio() {
  if (audioActivated) return Promise.resolve(true);
  setAudioStatus('Pista cargada. Haz clic en «Activar audio» en esta computadora.');
  return new Promise(resolve => activationWaiters.push(resolve));
}

function resolveActivationWaiters(activated) {
  const waiters = activationWaiters;
  activationWaiters = [];
  waiters.forEach(resolve => resolve(activated));
}

function adquirirControlProyector() {
  if (!navigator.locks || typeof navigator.locks.request !== 'function') {
    return Promise.resolve(true);
  }
  return new Promise((resolve, reject) => {
    navigator.locks.request('certamen-audicion-proyector', { ifAvailable: true }, lock => {
      if (!lock) {
        resolve(false);
        return;
      }
      resolve(true);
      return new Promise(release => {
        releaseProjectorControlLock = release;
      });
    }).catch(reject);
  });
}

function liberarControlProyector() {
  if (!releaseProjectorControlLock) return;
  releaseProjectorControlLock();
  releaseProjectorControlLock = null;
}

function desbloquearAudio() {
  const silentAudio = new Audio('data:audio/wav;base64,UklGRiUAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEAAACA');
  silentAudio.muted = true;
  return silentAudio.play().then(() => {
    silentAudio.pause();
    silentAudio.removeAttribute('src');
  });
}

function iniciarConsultaReproduccion() {
  if (playbackSyncTimeout || !activePlaybackCommandId) return;
  playbackSyncTimeout = setTimeout(async () => {
    playbackSyncTimeout = null;
    const commandId = activePlaybackCommandId;
    if (!commandId) return;

    try {
      const response = await api.getReproduccionProyector();
      if (activePlaybackCommandId === commandId && response.data) {
        sincronizarReproduccion(response.data);
      }
    } catch (error) {
      console.warn('[PROYECTOR] No se pudo consultar la orden activa:', error);
    }

    if (activePlaybackCommandId === commandId) iniciarConsultaReproduccion();
  }, 500);
}

function iniciarCuentaRegresiva(estado) {
  if (countdownInterval || playbackStarting || playbackInterval) return;
  const commandId = String(estado.commandId);
  const countdownEndsAt = performance.now() + 5000;
  if (elTimer) elTimer.dataset.running = 'true';
  cambiarColorTemporizador(true);
  if (elTimer) elTimer.textContent = '5';
  setAudioStatus('Preparados');
  countdownInterval = setInterval(() => {
    if (activePlaybackCommandId !== commandId) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }
    const seconds = Math.max(0, Math.ceil((countdownEndsAt - performance.now()) / 1000));
    if (seconds <= 0) {
      if (elTimer) elTimer.textContent = '1';
      clearInterval(countdownInterval);
      countdownInterval = null;
      playbackStarting = true;
      reproducirPista(estado)
        .catch(error => marcarErrorReproduccion(commandId, error));
    } else if (elTimer) {
      elTimer.textContent = String(seconds);
    }
  }, 100);
}

async function reproducirPista(estado) {
  const commandId = String(estado.commandId);
  if (activePlaybackCommandId !== commandId || !elAudio) return;
  if (playAttemptCommandId === commandId) return;
  playAttemptCommandId = commandId;
  try {
    await elAudio.play();
    if (activePlaybackCommandId !== commandId || stopRequestHandled) {
      elAudio.pause();
      return;
    }

    playbackStarting = false;
    playbackStartedAt = performance.now();
    playbackDuration = Number(estado.duration);
    playbackStateConfirmed = false;
    playbackStatePromise = api.actualizarReproduccionProyector({
      commandId,
      status: 'playing'
    }).then(() => {
      playbackStateConfirmed = true;
    });
    playbackStatePromise.catch(error => {
      console.error('[PROYECTOR] No se pudo confirmar el inicio; se reintentará al terminar:', error);
    });

    if (elTimer) elTimer.textContent = String(playbackDuration);
    cambiarColorTemporizador(false);
    setAudioStatus('🔊 Reproduciendo audición.');
    playbackInterval = setInterval(() => {
      const elapsed = (performance.now() - playbackStartedAt) / 1000;
      const elapsedSeconds = Math.min(playbackDuration, Math.floor(elapsed) + 1);
      if (elTimer) elTimer.textContent = String(elapsedSeconds);
    }, 100);
    programarFinReproduccion(commandId);
    elAudio.onended = () => {
      const elapsed = playbackStartedAt === null ? 0 : (performance.now() - playbackStartedAt) / 1000;
      if (elapsed + 0.1 >= playbackDuration) {
        completarReproduccion(commandId);
      } else {
        marcarErrorReproduccion(commandId, new Error('El archivo terminó antes de completar el tiempo solicitado.'));
      }
    };
  } catch (error) {
    elAudio.pause();
    throw error;
  }
}

function programarFinReproduccion(commandId) {
  if (playbackStartedAt === null || activePlaybackCommandId !== commandId) return;
  const remainingMs = playbackDuration * 1000 - (performance.now() - playbackStartedAt);
  if (remainingMs <= 0) {
    completarReproduccion(commandId);
    return;
  }
  playbackStopTimeout = setTimeout(() => programarFinReproduccion(commandId), remainingMs);
}

async function completarReproduccion(commandId) {
  if (activePlaybackCommandId !== commandId || completionSent) return;
  completionSent = true;
  if (playbackInterval) clearInterval(playbackInterval);
  if (playbackStopTimeout) clearTimeout(playbackStopTimeout);
  playbackInterval = null;
  playbackStopTimeout = null;
  if (elAudio) {
    elAudio.pause();
    elAudio.onended = null;
  }
  try {
    await confirmarInicioReproduccion(commandId);
    await api.actualizarReproduccionProyector({
      commandId,
      status: 'completed',
      playedDuration: playbackDuration
    });
    limpiarReproduccion();
    setAudioStatus('Audición finalizada.');
  } catch (error) {
    console.error('[PROYECTOR] No se pudo confirmar el fin de la audición:', error);
    setAudioStatus('Audición finalizada, pero no se pudo actualizar el estado del servidor.');
    completionSent = false;
    completionRetryTimeout = setTimeout(() => completarReproduccion(commandId), 3000);
  }
}

async function confirmarInicioReproduccion(commandId) {
  if (playbackStateConfirmed) return;
  try {
    try {
      await playbackStatePromise;
      if (playbackStateConfirmed) return;
    } catch (error) {
      console.warn('[PROYECTOR] Se reintentará confirmar el inicio:', error);
    }
    const current = await api.getReproduccionProyector();
    if (current.data && String(current.data.commandId) === commandId && current.data.status === 'playing') {
      playbackStateConfirmed = true;
      return;
    }
    await api.actualizarReproduccionProyector({ commandId, status: 'playing' });
    playbackStateConfirmed = true;
  } catch (error) {
    throw error;
  }
}

async function detenerReproduccionPorOrden(commandId) {
  if (activePlaybackCommandId !== commandId || stopRequestHandled) return;
  stopRequestHandled = true;
  const playedDuration = obtenerDuracionReproducida();
  if (elAudio) {
    elAudio.pause();
    elAudio.onended = null;
  }
  try {
    const data = { commandId, status: 'cancelled' };
    if (playbackStartedAt !== null) data.playedDuration = playedDuration;
    await api.actualizarReproduccionProyector(data);
    limpiarReproduccion();
    setAudioStatus('Audición detenida desde el panel del jurado.');
  } catch (error) {
    console.error('[PROYECTOR] No se pudo confirmar la detención:', error);
    stopRequestHandled = false;
  }
}

function obtenerDuracionReproducida() {
  if (playbackStartedAt === null) return 0;
  return Math.min(playbackDuration, Math.max(0, (performance.now() - playbackStartedAt) / 1000));
}

async function marcarErrorReproduccion(commandId, error) {
  if (activePlaybackCommandId !== commandId) return;
  console.error('[PROYECTOR] Error de reproducción:', error);
  const playedDuration = obtenerDuracionReproducida();
  limpiarReproduccion();
  setAudioStatus(`⚠️ Error de audio: ${error.message}`);
  try {
    await api.actualizarReproduccionProyector({
      commandId,
      status: 'error',
      error: error.message,
      playedDuration
    });
  } catch (updateError) {
    console.error('[PROYECTOR] No se pudo notificar el error al panel:', updateError);
  }
}

function limpiarReproduccion() {
  activePlaybackCommandId = null;
  if (countdownInterval) clearInterval(countdownInterval);
  if (playbackInterval) clearInterval(playbackInterval);
  if (playbackStopTimeout) clearTimeout(playbackStopTimeout);
  if (playbackSyncTimeout) clearTimeout(playbackSyncTimeout);
  if (completionRetryTimeout) clearTimeout(completionRetryTimeout);
  countdownInterval = null;
  playbackInterval = null;
  playbackStopTimeout = null;
  playbackSyncTimeout = null;
  completionRetryTimeout = null;
  playbackStarting = false;
  stopRequestHandled = false;
  playbackStartedAt = null;
  playbackDuration = 0;
  playAttemptCommandId = null;
  playbackStateConfirmed = false;
  playbackStatePromise = Promise.resolve();
  resolveActivationWaiters(false);
  if (elAudio) {
    elAudio.pause();
    elAudio.onended = null;
    elAudio.removeAttribute('src');
    elAudio.load();
  }
  if (elTimer) delete elTimer.dataset.running;
  cambiarColorTemporizador(false);
}

function setAudioStatus(message) {
  if (elAudioStatus) elAudioStatus.textContent = message;
}

function cambiarColorTemporizador(temporizadorCuentaRegresiva) {
  if (!elTimer) return;
  if (temporizadorCuentaRegresiva) {
    elTimer.style.color = '#ef4444';
    elTimer.style.textShadow = '0 15px 35px rgba(239, 68, 68, 0.55)';
  } else {
    elTimer.style.removeProperty('color');
    elTimer.style.removeProperty('text-shadow');
  }
}

/**
 * Cambia la vista del proyector según lo que ordenó el Jurado desde el Admin
 */
function aplicarModoVisual(modo, estado) {
  if (lastModo !== modo) {
    console.log(`[PROYECTOR] Cambiando vista a: ${modo}`);
    lastModo = modo;
  }

  // Ocultar todas las vistas primero
  if (viewAudicion) viewAudicion.classList.add('hidden');
  if (viewClasificados) viewClasificados.classList.add('hidden');
  if (viewRanking) viewRanking.classList.add('hidden');

  if (modo === 'CLASIFICADOS') {
    if (viewClasificados) viewClasificados.classList.remove('hidden');
    renderClasificados(estado);
  } else if (modo === 'RANKING_FINAL') {
    if (viewRanking) viewRanking.classList.remove('hidden');
    renderRankingProyector(estado);
    if (!confettiTriggered) {
      triggerConfetti();
    }
  } else {
    // Default: 'AUDICION'
    if (viewAudicion) viewAudicion.classList.remove('hidden');
  }
}

/**
 * Renderiza la cabecera y el temporizador
 */
function renderEstado(estado) {
  const ronda = estado.rondaActual || 1;
  const configRonda = CONFIG.ROUNDS[ronda] || { duracion: 40, audiciones: 4, nombre: `Ronda ${ronda}` };

  if (lastRonda !== null && lastRonda !== ronda) {
    if (elRondaNombre && elRondaNombre.parentElement) {
      elRondaNombre.parentElement.classList.add('animate-bounce');
      setTimeout(() => elRondaNombre.parentElement.classList.remove('animate-bounce'), 1000);
    }
  }
  lastRonda = ronda;

  if (elRondaNombre) {
    elRondaNombre.textContent = configRonda.nombre || `Ronda ${ronda}`;
  }

  if (elRondaDetalle) {
    elRondaDetalle.textContent = `${configRonda.duracion}s por audición • Mínimo ${configRonda.minimoPasar || 2} aciertos para clasificar`;
  }

  // Si no está corriendo el contador en vivo, muestra la duración configurada
  if (elTimer && !elTimer.dataset.running) {
    elTimer.textContent = String(configRonda.duracion);
  }
}

/**
 * Renderiza la vista de clasificados de la ronda
 */
function renderClasificados(estado) {
  if (!elClasificadosGrid) return;

  const ronda = estado.rondaActual || 1;
  const clasificadosInfo = estado.clasificadosRonda || { clasificados: [] };
  const clasificados = clasificadosInfo.clasificados || [];

  if (elClasificadosSub) {
    elClasificadosSub.textContent = `Ronda ${ronda}: Mínimo requerido de ${clasificadosInfo.minimoPasar || 2} aciertos`;
  }

  if (clasificados.length === 0) {
    elClasificadosGrid.innerHTML = `
      <div class="col-span-full text-center py-8 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-300">
        <p class="text-xl">${estado.rondaCerrada ? 'No hay participantes clasificados en esta ronda.' : 'Calculando resultados de la ronda...'}</p>
      </div>
    `;
    return;
  }

  elClasificadosGrid.innerHTML = clasificados.map(item => `
    <div class="bg-gradient-to-b from-slate-900 to-slate-800/90 border border-emerald-500/50 rounded-xl p-4 shadow-xl flex items-center justify-between">
      <div>
        <p class="font-extrabold text-lg text-white font-display">${formatNombre(item.nombre)}</p>
        <p class="text-xs text-emerald-300">${item.grado || ''}</p>
      </div>
      <div class="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-lg font-black text-sm">
        ✓ CLASIFICADO
      </div>
    </div>
  `).join('');
}

/**
 * Renderiza el ranking y el podio para la conclusión del certamen
 */
async function renderRankingProyector(estado) {
  let ranking = [];
  try {
    const rankRes = await api.getRanking();
    ranking = rankRes.data || [];
  } catch (e) {
    ranking = [];
  }

  if (!ranking || ranking.length === 0) return;

  if (elPodio) {
    const podiumStyles = {
      1: { medal: '👑', className: 'border-yellow-400 bg-yellow-950/50 text-yellow-200' },
      2: { medal: '🥈', className: 'border-slate-300 bg-slate-800/80 text-slate-200' },
      3: { medal: '🥉', className: 'border-amber-600 bg-amber-950/50 text-amber-200' }
    };
    elPodio.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 items-end gap-4 max-w-5xl mx-auto mb-8">${
      [2, 1, 3].map(position => {
        const members = ranking.filter((item, index) => getRankPosition(item, index) === position);
        const style = podiumStyles[position];
        if (members.length === 0) return '<div class="min-h-24"></div>';
        return `
          <div class="rounded-2xl border-2 ${style.className} p-4 text-center shadow-xl">
            <div class="mb-3 text-3xl">${style.medal} <span class="text-xl font-black">${position}°</span></div>
            <div class="space-y-3">
              ${members.map(item => `
                <div class="rounded-xl bg-slate-950/50 p-3">
                  <p class="font-extrabold text-white">${formatNombre(item.nombre)}</p>
                  <p class="text-sm text-slate-300">${item.grado || ''}</p>
                  <p class="mt-1 text-xl font-black text-yellow-300">${item.puntosTotal || 0} pts</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')
    }</div>`;
  }

  if (elRankingTable) {
    elRankingTable.innerHTML = ranking.map((item, idx) => {
      const pos = getRankPosition(item, idx);
      let badge = `${pos}°`;
      let rowBg = 'border-slate-800 bg-slate-900/40';

      if (pos === 1) {
        badge = '🥇 1°';
        rowBg = 'border-yellow-500/40 bg-yellow-500/10 font-bold';
      } else if (pos === 2) {
        badge = '🥈 2°';
        rowBg = 'border-slate-400/40 bg-slate-400/10';
      } else if (pos === 3) {
        badge = '🥉 3°';
        rowBg = 'border-amber-600/40 bg-amber-600/10';
      }

      const estadoText = item.eliminado 
        ? `Eliminado en Ronda ${item.rondaEliminacion || 1}` 
        : `Clasificado (Ronda ${item.rondaMax || 1})`;
      const trayectoria = renderTrayectoriaProyector(item);

      return `
        <tr class="border-b ${rowBg} text-lg md:text-xl transition-colors">
          <td class="py-3 px-4 text-center font-black">${badge}</td>
          <td class="py-3 px-4 font-semibold text-white">${formatNombre(item.nombre)}</td>
          <td class="py-3 px-4 text-slate-300">${item.grado || ''}</td>
          <td class="py-3 px-4 text-center">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${item.eliminado ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}">
              ${estadoText}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="flex flex-wrap gap-1">${trayectoria}</div>
          </td>
          <td class="py-3 px-4 text-right font-black text-yellow-400 text-2xl">${item.puntosTotal || 0}</td>
        </tr>
      `;
    }).join('');
  }
}

function getRankPosition(item, index) {
  const position = Number(item.posicion);
  return Number.isInteger(position) && position > 0 ? position : index + 1;
}

function renderTrayectoriaProyector(item) {
  const details = item.detalleRondas || {};
  return Array.from({ length: CONFIG.TOTAL_RONDAS }, (_, index) => {
    const round = index + 1;
    const key = `ronda_${round}`;
    if (!Object.prototype.hasOwnProperty.call(details, key)) {
      if (round <= Number(item.rondaMax || 0)) {
        return `<span class="rounded bg-cyan-950 px-2 py-1 text-xs text-cyan-200">R${round} en curso</span>`;
      }
      return `<span class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-500">R${round} —</span>`;
    }

    const score = Number(details[key]);
    const total = CONFIG.ROUNDS[round] ? CONFIG.ROUNDS[round].audiciones : '?';
    return `<span class="rounded bg-emerald-950 px-2 py-1 text-xs text-emerald-200">R${round} ${Number.isFinite(score) ? score : '—'}/${total}</span>`;
  }).join('');
}

function triggerConfetti() {
  confettiTriggered = true;
  if (window.confetti) {
    window.confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.6 }
    });
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => console.log(err));
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

document.addEventListener('DOMContentLoaded', initProyector);
