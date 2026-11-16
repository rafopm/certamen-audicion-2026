/**
 * Configuración central de la aplicación.
 * Sincroniza dinámicamente con Google Sheets para soportar cualquier número
 * de rondas, duraciones y mínimos de clasificación configurados por el jurado.
 */
export const CONFIG = {
  // URL del backend (Google Apps Script)
  API_URL: 'https://script.google.com/macros/s/AKfycbyr3B86WZhhfGYBU3ngR8LW3tID_pJRPpjORHu3ALyV3zL5NJrRJDouUwGFfdN2ZGRV/exec',
  
  // Total de rondas configuradas (default 5, editable desde panel)
  TOTAL_RONDAS: 5,

  // Definición de rondas con valores iniciales por defecto
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
  VERSION: '1.2.0',

  /**
   * Sincroniza la configuración de rondas con la hoja 'Config' de Google Sheets.
   * Permite que el certamen sea 100% dinámico y escalable (ej. certámenes de 3, 4, 5 o más rondas).
   */
  syncFromBackend(cfg) {
    if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return;

    const configuredTotal = Number(cfg.TOTAL_RONDAS || this.TOTAL_RONDAS);
    const total = Number.isInteger(configuredTotal) && configuredTotal > 0
      ? configuredTotal
      : this.TOTAL_RONDAS;
    const anio = Number(cfg.ANIO_CERTAMEN);

    if (Number.isInteger(anio) && anio > 0) this.ANIO = anio;
    this.TOTAL_RONDAS = total;

    const nuevasRondas = {};

    for (let r = 1; r <= total; r++) {
      const isFinal = (r === total);
      const suffix = getRoundConfigSuffix(r, total);
      const defaultRound = this.ROUNDS[r] || {};

      const dur = readPositiveInteger(
        cfg[`DURACION_RONDA_${suffix}`] ?? cfg[`DURACION_RONDA_${r}`],
        defaultRound.duracion || (isFinal ? 2 : Math.max(2, Math.round(40 / Math.pow(2, r - 1))))
      );

      const aud = readPositiveInteger(
        cfg[`NUM_AUDICIONES_RONDA_${suffix}`] ?? cfg[`NUM_AUDICIONES_RONDA_${r}`],
        defaultRound.audiciones || (r <= 2 ? 4 : 3)
      );

      const min = readPositiveInteger(
        cfg[`MINIMO_PASAR_RONDA_${suffix}`] ?? cfg[`MINIMO_PASAR_RONDA_${r}`],
        defaultRound.minimoPasar || (isFinal ? 3 : 2)
      );

      nuevasRondas[r] = {
        audiciones: aud,
        duracion: dur,
        minimoPasar: min,
        nombre: isFinal ? 'Ronda Final' : `Ronda ${r}`
      };
    }

    this.ROUNDS = nuevasRondas;
  }
};

export function getRoundConfigSuffix(round, totalRounds = CONFIG.TOTAL_RONDAS) {
  return round === 5 && totalRounds === 5 ? 'FINAL' : String(round);
}

function readPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
