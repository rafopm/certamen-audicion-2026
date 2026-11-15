/**
 * Script de la Vista de Proyector (Pantalla Grande).
 * Sincronización continua vía polling cada 2s con el backend de Google Apps Script.
 * Soporta los 3 modos oficiales:
 * 1. 'AUDICION': Solo temporizador gigante y foco musical (sin ranking público).
 * 2. 'CLASIFICADOS': Muestra únicamente a los clasificados al concluir cada ronda.
 * 3. 'RANKING_FINAL': Revela el podio con coronas, tabla completa y confeti al finalizar.
 */
import { api } from './services/api.js';
import { CONFIG } from './config.js';
import { formatNombre, formatRanking } from './utils/formatters.js';

let lastRonda = null;
let lastModo = null;
let confettiTriggered = false;

// Elementos DOM
const elRondaNombre = document.getElementById('proj-ronda-nombre');
const elRondaDetalle = document.getElementById('proj-ronda-detalle');
const elTimer = document.getElementById('proj-timer');
const elLiveIndicator = document.getElementById('proj-live-status');

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

      // Sincronizar modo visual
      const modo = estado.modoProyector || 'AUDICION';
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
        <p class="text-xl">Calculando resultados de la ronda...</p>
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

  const top3 = ranking.slice(0, 3);
  const [primero, segundo, tercero] = top3;

  if (elPodio) {
    elPodio.innerHTML = `
      <div class="flex justify-center items-end gap-6 max-w-4xl mx-auto mb-8">
        <!-- 2do -->
        <div class="flex-1 text-center">
          ${segundo ? `
            <div class="bg-slate-800/80 border-2 border-slate-300 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥈</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${formatNombre(segundo.nombre)}</p>
              <p class="text-sm text-slate-300">${segundo.grado || ''}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${segundo.puntosTotal || 0} pts</p>
              <div class="h-20 bg-slate-700 rounded-lg mt-3 flex items-center justify-center text-slate-300 font-bold text-xl">2° Lugar</div>
            </div>
          ` : ''}
        </div>

        <!-- 1ro -->
        <div class="flex-1 text-center transform -translate-y-4">
          ${primero ? `
            <div class="bg-gradient-to-b from-yellow-950/80 to-slate-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <span class="text-5xl animate-bounce inline-block">👑</span>
              <p class="font-black text-2xl text-yellow-300 truncate mt-1">${formatNombre(primero.nombre)}</p>
              <p class="text-sm text-yellow-200/80">${primero.grado || ''}</p>
              <p class="text-4xl font-black text-yellow-400 mt-2">${primero.puntosTotal || 0} pts</p>
              <div class="h-28 bg-gradient-to-t from-yellow-600 to-yellow-400 text-slate-950 rounded-lg mt-3 flex items-center justify-center font-black text-2xl shadow-lg">🥇 1° Puesto</div>
            </div>
          ` : ''}
        </div>

        <!-- 3ro -->
        <div class="flex-1 text-center">
          ${tercero ? `
            <div class="bg-slate-800/80 border-2 border-amber-600 rounded-2xl p-4 shadow-xl">
              <span class="text-3xl">🥉</span>
              <p class="font-extrabold text-xl text-white truncate mt-1">${formatNombre(tercero.nombre)}</p>
              <p class="text-sm text-slate-300">${tercero.grado || ''}</p>
              <p class="text-2xl font-black text-yellow-400 mt-2">${tercero.puntosTotal || 0} pts</p>
              <div class="h-16 bg-amber-800 rounded-lg mt-3 flex items-center justify-center text-amber-200 font-bold text-xl">3° Lugar</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  if (elRankingTable) {
    elRankingTable.innerHTML = ranking.map((item, idx) => {
      const pos = idx + 1;
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
          <td class="py-3 px-4 text-right font-black text-yellow-400 text-2xl">${item.puntosTotal || 0}</td>
        </tr>
      `;
    }).join('');
  }
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
