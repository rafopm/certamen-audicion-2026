/**
 * Utilidades de formateo para el certamen.
 */

/**
 * Convierte una cantidad de segundos a formato MM:SS (ej: 40 -> "0:40", 5 -> "0:05")
 * @param {number} segundos
 * @returns {string}
 */
export function formatTiempo(segundos) {
  const seg = Math.max(0, Math.floor(Number(segundos) || 0));
  const mins = Math.floor(seg / 60);
  const remainingSegs = seg % 60;
  return `${mins}:${remainingSegs.toString().padStart(2, '0')}`;
}

/**
 * Capitaliza apropiadamente nombres y apellidos (ej: "JUAN CARLOS PÉREZ" -> "Juan Carlos Pérez")
 * @param {string} nombre
 * @returns {string}
 */
export function formatNombre(nombre) {
  if (!nombre) return '';
  const preposiciones = ['de', 'del', 'la', 'las', 'los', 'y', 'e', 'van', 'von'];
  
  return String(nombre)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((palabra, index) => {
      if (index > 0 && preposiciones.includes(palabra)) {
        return palabra;
      }
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(' ');
}

/**
 * Formatea la posición en el ranking (1 -> "1°", 2 -> "2°", etc.)
 * @param {number} posicion
 * @returns {string}
 */
export function formatRanking(posicion) {
  const pos = parseInt(posicion, 10);
  if (isNaN(pos) || pos <= 0) return '-';
  return `${pos}°`;
}

/**
 * Formatea puntos con sufijo pluralizado (ej: 1 -> "1 pt", 3 -> "3 pts")
 * @param {number} puntos
 * @returns {string}
 */
export function formatPuntos(puntos) {
  const p = Number(puntos) || 0;
  return `${p} ${p === 1 ? 'punto' : 'puntos'}`;
}
