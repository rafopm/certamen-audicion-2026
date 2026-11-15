/**
 * Lógica de cálculo de puntajes.
 * Separada para permitir futuras modificaciones (ej: puntos bonus).
 */

/**
 * Calcula puntos por acierto (actualmente 1 punto por acierto)
 * En el futuro puedes agregar lógica de bonus por tiempo, etc.
 */
export function calcularPuntos(acerto, tiempoRestante = 0) {
  return acerto ? 1 : 0;
}

/**
 * Actualiza los totales de un alumno
 */
export function actualizarTotalAlumno(alumno, nuevaAudicion) {
  return {
    ...alumno,
    aciertos: alumno.aciertos + (nuevaAudicion.acerto ? 1 : 0),
    puntosTotal: alumno.puntosTotal + calcularPuntos(nuevaAudicion.acerto)
  };
}