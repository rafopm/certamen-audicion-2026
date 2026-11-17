/**
 * Lógica de cálculo de puntajes.
 * Separada para permitir futuras modificaciones (ej: puntos bonus).
 */

/**
 * Calcula los puntos de un acierto según la ronda.
 */
export function calcularPuntos(acerto, puntosPorAcierto = 1) {
  const puntos = Number(puntosPorAcierto);
  return acerto && Number.isInteger(puntos) && puntos >= 0 ? puntos : 0;
}

/**
 * Calcula el puntaje de una ronda y agrega el bonus una sola vez al clasificar.
 */
export function calcularPuntosRonda(aciertos, clasifica, configRonda = {}) {
  const totalAciertos = Number(aciertos);
  const puntosPorAcierto = configRonda.puntosPorAcierto === undefined
    ? 1
    : Number(configRonda.puntosPorAcierto);
  const bonusClasificar = configRonda.bonusClasificar === undefined
    ? 0
    : Number(configRonda.bonusClasificar);
  if (!Number.isInteger(totalAciertos) || totalAciertos < 0 ||
      !Number.isInteger(puntosPorAcierto) || puntosPorAcierto < 0 ||
      !Number.isInteger(bonusClasificar) || bonusClasificar < 0) {
    return 0;
  }
  return totalAciertos * puntosPorAcierto + (clasifica ? bonusClasificar : 0);
}

/**
 * Actualiza los totales de un alumno
 */
export function actualizarTotalAlumno(alumno, nuevaAudicion, configRonda = { puntosPorAcierto: 1 }) {
  const acierto = Boolean(nuevaAudicion.acerto);
  const puntosPorAcierto = configRonda.puntosPorAcierto === undefined
    ? 1
    : configRonda.puntosPorAcierto;
  return {
    ...alumno,
    aciertos: alumno.aciertos + (acierto ? 1 : 0),
    puntosTotal: alumno.puntosTotal + calcularPuntos(acierto, puntosPorAcierto)
  };
}