/**
 * Módulo principal: orquesta todos los componentes.
 * Inicializa el estado, carga datos iniciales y enlaza UI y eventos.
 */
import { appState } from './core/state.js';
import { api } from './services/api.js';
import { CONFIG } from './config.js';
import { AudioPlayer } from './components/audio-player.js';
import { renderAlumnos, renderAudiciones, renderTimer } from './ui/render.js';
import { setupEventListeners } from './ui/events.js';
import { DOM } from './ui/dom.js';
import { initConfigPanel } from './ui/config-panel.js';

/**
 * Inicializa la aplicación completa
 */
export async function initApp() {
  // Inicializar selectores y elementos de feedback
  DOM.init();
  DOM.showLoading('Conectando con el certamen...');

  try {
    // 1. Cargar datos iniciales en paralelo
    let canciones = [];
    let alumnos = [];
    let audiciones = [];
    let resultados = [];
    let rondaActual = 1;

    try {
      const [cancionesRes, alumnosRes, estadoRes] = await Promise.all([
        api.getCanciones().catch(() => ({ data: [] })),
        api.getAlumnos().catch(() => ({ data: [] })),
        api.getEstadoCertamen().catch(() => ({ data: null }))
      ]);

      canciones = cancionesRes.data || [];
      alumnos = alumnosRes.data || [];

      if (estadoRes && estadoRes.data) {
        rondaActual = estadoRes.data.rondaActual || 1;
        audiciones = estadoRes.data.audicionesRonda || [];
        resultados = estadoRes.data.resultadosRonda || [];
      } else {
        // Carga directa de la ronda 1
        const [audRes, resRes] = await Promise.all([
          api.getAudicionesRonda(rondaActual).catch(() => ({ data: [] })),
          api.getResultados(rondaActual).catch(() => ({ data: [] }))
        ]);
        audiciones = audRes.data || [];
        resultados = resRes.data || [];
      }
    } catch (netErr) {
      console.warn('[APP] Aviso de red al conectar backend Apps Script:', netErr);
      DOM.showToast('Modo sin conexión o URL de Apps Script pendiente. Cargando vista.', 'warning', 4000);
    }

    // 2. Establecer estado inicial
    appState.set({
      canciones: canciones,
      alumnos: alumnos,
      rondaActual: rondaActual,
      audicionesRonda: audiciones,
      resultados: resultados,
      isLoading: false
    });

    // 3. Inicializar componentes de Audio y Timer
    const audioElement = DOM.get('audioPlayer');
    const timerDisplay = DOM.get('timerDisplay');
    const player = new AudioPlayer(audioElement, timerDisplay, {
      onComplete: () => console.log('[PLAYER] Audición finalizada')
    });

    // 4. Configurar event listeners y panel de configuración
    setupEventListeners(player);
    initConfigPanel();

    // 5. Sincronizar selector de ronda
    const selectRonda = DOM.get('selectRonda');
    if (selectRonda) {
      selectRonda.value = String(rondaActual);
    }

    // 6. Renderizar UI inicial
    const duracion = (CONFIG.ROUNDS[rondaActual] || {}).duracion || 40;
    renderTimer(duracion, duracion);
    renderAudiciones(appState.get());
    renderAlumnos(appState.get());

    console.log('✅ Aplicación inicializada correctamente');
    DOM.showToast('Certamen listo para audición', 'success', 2500);

  } catch (error) {
    console.error('❌ Error al inicializar:', error);
    DOM.showToast('Error al conectar con la base de datos de Google Sheets.', 'error', 5000);
  } finally {
    DOM.hideLoading();
  }
}

// Arrancar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
