/**
 * Reglas puras del certamen.
 * No depende de UI ni de API, solo lógica pura.
 * Fácil de testear.
 */
import { CONFIG } from '../config.js';

/**
 * Determina qué alumnos pasan a la siguiente ronda
 * @param {Array} resultados - Array de resultados de alumnos
 * @param {number} ronda - Número de ronda
 * @returns {Object} { pasan: [], eliminados: [] }
 */
export function calcularClasificacion(resultados, ronda) {
  const config = CONFIG.ROUNDS[ronda];
  if (!config) throw new Error(`Ronda ${ronda} no válida`);

  const pasan = [];
  const eliminados = [];

  resultados.forEach(alumno => {
    if (alumno.aciertos >= config.minimoPasar) {
      pasan.push(alumno);
    } else {
      eliminados.push(alumno);
    }
  });

  return { pasan, eliminados };
}

/**
 * Obtiene la configuración de una ronda
 */
export function getConfigRonda(ronda) {
  return CONFIG.ROUNDS[ronda] || null;
}

export function getResponsesForAudition(responses, auditionNum) {
  return new Map(
    (Array.isArray(responses) ? responses : [])
      .filter(response => Number(response.audicionNum) === Number(auditionNum))
      .map(response => [String(response.alumnoId), response])
  );
}

export function isAuditionSaved(responses, auditionNum, participantIds) {
  if (!Array.isArray(participantIds) || participantIds.length === 0) return false;
  const saved = getResponsesForAudition(responses, auditionNum);
  return participantIds.every(id => saved.has(String(id)));
}

/**
 * Calcula el ranking final ordenado por puntaje
 */
export function calcularRanking(resultados) {
  return [...resultados]
    .sort((a, b) => b.puntosTotal - a.puntosTotal)
    .map((alumno, index) => ({ ...alumno, posicion: index + 1 }));
}

/**
 * Obtiene el TOP 3 para premiación
 */
export function getTopTres(resultados) {
  return calcularRanking(resultados).slice(0, 3);
}