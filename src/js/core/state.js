/**
 * Estado global de la aplicación.
 * Patrón Observer: notifica a los suscriptores cuando cambia.
 */
class AppState {
  constructor() {
    this.state = {
      rondaActual: 1,
      rondaVista: 1,
      rondaCerrada: false,
      rondaHistorial: null,
      audicionActual: 0,
      alumnos: [],
      canciones: [],
      configRonda: null,
      resultados: {},
      respuestasAudicion: [],
      isLoading: false,
      error: null
    };
    this.listeners = [];
  }

  /**
   * Obtiene el estado actual (inmutable)
   */
  get() {
    return { ...this.state };
  }

  /**
   * Actualiza el estado y notifica a los listeners
   */
  set(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Suscribe una función para recibir notificaciones de cambios
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Instancia única (singleton)
export const appState = new AppState();