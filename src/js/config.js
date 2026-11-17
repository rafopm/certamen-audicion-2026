/**
 * Configuración central de la aplicación.
 * Sincroniza dinámicamente con la base de datos para soportar cualquier número
 * de rondas, duraciones y mínimos de clasificación configurados por el jurado.
 */
export const CONFIG = {
  // Dirección del servicio de datos
  API_URL: 'https://script.google.com/macros/s/AKfycbzQbiFEfylHoZu2G2bemw4frPyvmNrZDUmq7kUCmsE5DMGwYvyoGMngWUOp60_1qx9V/exec',
  
  // Total de rondas configuradas (default 5, editable desde panel)
  TOTAL_RONDAS: 5,
  COMPLETED_ROUNDS: {},

  // Definición de rondas con valores iniciales por defecto
  ROUNDS: {
    1: { audiciones: 4, duracion: 40, minimoPasar: 2, puntosPorAcierto: 1, bonusClasificar: 0, nombre: 'Ronda 1' },
    2: { audiciones: 4, duracion: 20, minimoPasar: 2, puntosPorAcierto: 1, bonusClasificar: 0, nombre: 'Ronda 2' },
    3: { audiciones: 3, duracion: 10, minimoPasar: 2, puntosPorAcierto: 1, bonusClasificar: 0, nombre: 'Ronda 3' },
    4: { audiciones: 3, duracion: 5,  minimoPasar: 2, puntosPorAcierto: 1, bonusClasificar: 0, nombre: 'Ronda 4' },
    5: { audiciones: 3, duracion: 2,  minimoPasar: 3, puntosPorAcierto: 1, bonusClasificar: 0, nombre: 'Ronda Final' }
  },
  
  // Año del certamen
  ANIO: 2026,
  
  // Versionado para cache busting
  VERSION: '1.2.0',

  /**
   * Sincroniza la configuración de rondas con la base de datos.
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
    this.COMPLETED_ROUNDS = {};

    const nuevasRondas = {};

    for (let r = 1; r <= total; r++) {
      const completed = cfg[`RONDA_CERRADA_${r}`];
      this.COMPLETED_ROUNDS[r] = completed === true || String(completed).toUpperCase() === 'TRUE';
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
      const puntosPorAcierto = readNonNegativeInteger(
        cfg[`PUNTOS_POR_ACIERTO_RONDA_${suffix}`] ?? cfg[`PUNTOS_POR_ACIERTO_RONDA_${r}`],
        defaultRound.puntosPorAcierto === undefined ? 1 : defaultRound.puntosPorAcierto
      );
      const bonusClasificar = readNonNegativeInteger(
        cfg[`BONUS_POR_CLASIFICAR_RONDA_${suffix}`] ?? cfg[`BONUS_POR_CLASIFICAR_RONDA_${r}`],
        defaultRound.bonusClasificar === undefined ? 0 : defaultRound.bonusClasificar
      );

      nuevasRondas[r] = {
        audiciones: aud,
        duracion: dur,
        minimoPasar: min,
        puntosPorAcierto,
        bonusClasificar,
        nombre: isFinal ? 'Ronda Final' : `Ronda ${r}`
      };
    }

    this.ROUNDS = nuevasRondas;
  }
};

export function getRoundConfigSuffix(round, totalRounds = CONFIG.TOTAL_RONDAS) {
  return round === 5 && totalRounds === 5 ? 'FINAL' : String(round);
}

export function getRoundOptionLabel(round, config = CONFIG.ROUNDS[round]) {
  if (!config) return '';
  const label = `${config.nombre} - ${config.audiciones} audiciones de ${config.duracion}s (mínimo: ${config.minimoPasar}, ${config.puntosPorAcierto} pts/acierto, +${config.bonusClasificar} bonus)`;
  return CONFIG.COMPLETED_ROUNDS[round] ? `${label} · ✓ Completada` : label;
}

function readPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readNonNegativeInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}
