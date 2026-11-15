/**
 * Helpers para manipulación del DOM.
 * Centraliza todos los selectores y utilidades de feedback visual (toast, loading).
 */

export const DOM = {
  // Selectores cacheados
  elements: {},

  init() {
    this._ensureFeedbackElements();

    this.elements = {
      selectRonda: document.getElementById('select-ronda'),
      audicionNumero: document.getElementById('audicion-numero'),
      audioPlayer: document.getElementById('audio-player'),
      timerDisplay: document.getElementById('timer-display'),
      btnPlay: document.getElementById('btn-play'),
      listaAlumnos: document.getElementById('lista-alumnos'),
      btnGuardarAciertos: document.getElementById('btn-guardar-aciertos'),
      btnFinalizarRonda: document.getElementById('btn-finalizar-ronda'),
      btnResetRonda: document.getElementById('btn-reset-ronda'),
      btnVerRanking: document.getElementById('btn-ver-ranking'),
      rankingSection: document.getElementById('ranking-section'),
      rankingContent: document.getElementById('ranking-content'),
      loadingOverlay: document.getElementById('loading-overlay'),
      toast: document.getElementById('toast')
    };

    return this.elements;
  },

  /**
   * Garantiza que existan elementos de feedback en el DOM (Overlay y Toast)
   */
  _ensureFeedbackElements() {
    if (!document.getElementById('loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center transition-opacity duration-300 hidden';
      overlay.innerHTML = `
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
        <p id="loading-text" class="text-white text-xl font-semibold tracking-wide">Cargando...</p>
      `;
      document.body.appendChild(overlay);
    }

    if (!document.getElementById('toast')) {
      const toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none flex items-center space-x-3';
      document.body.appendChild(toast);
    }
  },

  /**
   * Obtiene un elemento cacheado por su clave
   * @param {string} key
   * @returns {HTMLElement}
   */
  get(key) {
    if (!this.elements[key]) {
      this.elements[key] = document.getElementById(key);
    }
    return this.elements[key];
  },

  /**
   * Muestra el overlay de carga con mensaje opcional
   * @param {string} message
   */
  showLoading(message = 'Procesando...') {
    const overlay = this.get('loadingOverlay');
    if (overlay) {
      const textEl = document.getElementById('loading-text');
      if (textEl) textEl.textContent = message;
      overlay.classList.remove('hidden');
      setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    }
  },

  /**
   * Oculta el overlay de carga
   */
  hideLoading() {
    const overlay = this.get('loadingOverlay');
    if (overlay) {
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.classList.add('hidden'), 250);
    }
  },

  /**
   * Muestra notificación Toast flotante
   * @param {string} message - Texto del mensaje
   * @param {'info'|'success'|'error'|'warning'} type - Tipo de notificación
   * @param {number} duration - Milisegundos visible
   */
  showToast(message, type = 'info', duration = 3500) {
    const toast = this.get('toast');
    if (!toast) return;

    // Colores según tipo
    const colors = {
      success: 'bg-emerald-600 border border-emerald-400',
      error: 'bg-rose-600 border border-rose-400',
      warning: 'bg-amber-600 border border-amber-400',
      info: 'bg-blue-600 border border-blue-400'
    };

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.className = `fixed bottom-5 right-5 z-50 max-w-md px-6 py-4 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-300 flex items-center space-x-3 ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <span class="text-2xl font-bold">${icons[type] || 'ℹ'}</span>
      <span class="flex-1">${message}</span>
    `;

    // Animar entrada
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, duration);
  }
};
