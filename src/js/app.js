/**
 * Módulo principal: orquesta todos los componentes.
 * Inicializa el estado, carga datos iniciales y enlaza UI y eventos.
 */
import { appState } from './core/state.js';
import { api } from './services/api.js';
import { CONFIG, getRoundOptionLabel } from './config.js';
import { renderAlumnos, renderAudiciones } from './ui/render.js';
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
    let respuestasAudicion = [];
    let rondaActual = 1;
    let rondaCerrada = false;

    try {
      const [configRes, cancionesRes, alumnosRes, estadoRes] = await Promise.all([
        api.getConfig().catch(err => {
          console.warn('[APP] No se pudo cargar configuración del backend:', err);
          return { data: {} };
        }),
        api.getCanciones().catch(() => ({ data: [] })),
        api.getAlumnos().catch(() => ({ data: [] })),
        api.getEstadoCertamen().catch(() => ({ data: null }))
      ]);

      CONFIG.syncFromBackend(configRes.data || {});
      canciones = cancionesRes.data || [];
      alumnos = alumnosRes.data || [];

      if (estadoRes && estadoRes.data) {
        rondaActual = estadoRes.data.rondaActual || 1;
        rondaCerrada = Boolean(estadoRes.data.rondaCerrada);
      }

      if (!CONFIG.ROUNDS[rondaActual]) rondaActual = 1;
      const [audRes, resRes, respuestasRes] = await Promise.all([
        api.getAudicionesRonda(rondaActual).catch(() => ({ data: [] })),
        api.getResultados(rondaActual).catch(() => ({ data: [] })),
        api.getRespuestasRonda(rondaActual).catch(err => {
          console.warn('[APP] Backend aún no expone las respuestas por audición:', err);
          return { data: [] };
        })
      ]);
      audiciones = audRes.data || [];
      resultados = resRes.data || [];
      respuestasAudicion = respuestasRes.data || [];
    } catch (netErr) {
      console.warn('[APP] Aviso de red al conectar el servicio de datos:', netErr);
      DOM.showToast('Modo sin conexión o dirección del servicio de datos pendiente. Cargando vista.', 'warning', 4000);
    }

    // 2. Establecer estado inicial
    appState.set({
      canciones: canciones,
      alumnos: alumnos,
      rondaActual: rondaActual,
      rondaCerrada,
      audicionActual: 1,
      audicionesRonda: audiciones,
      resultados: resultados,
      respuestasAudicion: respuestasAudicion,
      isLoading: false
    });

    // 3. Configurar event listeners y panel de configuración
    setupEventListeners();
    initConfigPanel();

    // 5. Sincronizar selector de ronda
    const selectRonda = DOM.get('selectRonda');
    if (selectRonda) {
      selectRonda.innerHTML = Object.entries(CONFIG.ROUNDS).map(([round, config]) =>
        `<option value="${round}">${getRoundOptionLabel(round, config)}</option>`
      ).join('');
      selectRonda.value = String(rondaActual);
    }

    // 6. Renderizar UI inicial
    renderAudiciones(appState.get());
    renderAlumnos(appState.get());

    console.log('✅ Aplicación inicializada correctamente');
    DOM.showToast('Certamen listo para audición', 'success', 2500);

  } catch (error) {
    console.error('❌ Error al inicializar:', error);
    DOM.showToast('Error al conectar con la base de datos.', 'error', 5000);
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
