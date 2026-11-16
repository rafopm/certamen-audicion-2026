/**
 * Utilidades de validación para el certamen.
 */

/**
 * Extrae el ID limpio de Google Drive a partir de una URL completa o ID directo.
 * Ignora marcadores de posición como [FILE_ID].
 * @param {string} input
 * @returns {string} ID limpio o cadena vacía si no es válido
 */
export function extractDriveId(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  
  // Ignorar placeholders comunes como [FILE_ID] o vacíos
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return '';
  if (trimmed.toLowerCase() === 'file_id' || trimmed === '') return '';

  // Caso 1: URL completa tipo https://drive.google.com/file/d/ID_AQUI/view...
  const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];

  // Caso 2: URL tipo https://drive.google.com/open?id=ID_AQUI o &id=ID_AQUI
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // Caso 3: URL corta tipo /d/ID_AQUI
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  // Caso 4: Cadena que ya es un ID de Drive válido (20 a 60 caracteres)
  if (/^[a-zA-Z0-9_-]{20,60}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

import { CONFIG } from '../config.js';

/**
 * Valida que la ronda sea un número entero entre 1 y el total de rondas configuradas
 * @param {number|string} ronda
 * @param {number} [maxRondas]
 * @returns {boolean}
 */
export function isValidRonda(ronda, maxRondas = (CONFIG.TOTAL_RONDAS || 5)) {
  const num = Number(ronda);
  return Number.isInteger(num) && num >= 1 && num <= maxRondas;
}

/**
 * Valida si un string parece un ID de archivo válido de Google Drive
 * (típicamente 20-60 caracteres alfanuméricos, guiones y guiones bajos)
 * @param {string} id
 * @returns {boolean}
 */
export function isValidFileId(id) {
  const clean = extractDriveId(id);
  if (!clean) return false;
  return /^[a-zA-Z0-9_-]{20,60}$/.test(clean);
}

/**
 * Sanitiza texto para prevenir XSS e inyecciones básicas en el DOM
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function normalizeAnswer(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Valida si una lista de aciertos tiene datos consistentes
 * @param {Object|Array} aciertos
 * @returns {boolean}
 */
export function isValidAciertosData(aciertos) {
  if (!aciertos) return false;
  if (Array.isArray(aciertos)) {
    return aciertos.length > 0 && aciertos.every(item => item.alumnoId !== undefined);
  }
  return typeof aciertos === 'object' && Object.keys(aciertos).length > 0;
}
