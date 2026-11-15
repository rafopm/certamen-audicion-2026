/**
 * Configuración central de la aplicación.
 * Cambia aquí las URLs y constantes globales.
 */
export const CONFIG = {
  // URL del backend (Google Apps Script)
  API_URL: 'https://script.google.com/macros/s/AKfycbx1iJ7MKT4415XUTd_X6eqP_LNNmpEl5xQO1jjBdcdB_tKkc5S1qnYrH0IkQ3USqKyM/exec',
  
  ROUNDS: {
    1: { audiciones: 4, duracion: 40, minimoPasar: 2, nombre: 'Ronda 1' },
    2: { audiciones: 4, duracion: 20, minimoPasar: 2, nombre: 'Ronda 2' },
    3: { audiciones: 3, duracion: 10, minimoPasar: 2, nombre: 'Ronda 3' },
    4: { audiciones: 3, duracion: 5,  minimoPasar: 2, nombre: 'Ronda 4' },
    5: { audiciones: 3, duracion: 2,  minimoPasar: 3, nombre: 'Ronda Final' }
  },
  
  // Año del certamen
  ANIO: 2026,
  
  // Versionado para cache busting
  VERSION: '1.0.0'
};