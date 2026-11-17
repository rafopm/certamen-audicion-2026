/**
 * Módulo de renderizado de UI para el Certamen de Audición Musical 2026.
 */
import { DOM } from './dom.js';
import { formatNombre, formatRanking, formatTiempo, formatPuntos } from '../utils/formatters.js';
import { sanitizeInput } from '../utils/validators.js';
import { CONFIG } from '../config.js';

/**
 * Renderiza la lista de alumnos con soporte para checkboxes de acierto y validación de pizarras.
 */
export function renderAlumnos(arg1, arg2) {
  let alumnos = [];
  let resultados = [];
  let respuestasAudicion = [];
  let rondaActual = 1;
  let rondaCerrada = false;
  let soloLectura = false;
  let totalAudiciones = 4;
  let audicionActualNum = 1;

  if (arg1 && Array.isArray(arg1.alumnos)) {
    alumnos = arg1.alumnos || [];
    resultados = Array.isArray(arg1.resultados) ? arg1.resultados : Object.values(arg1.resultados || {});
    respuestasAudicion = Array.isArray(arg1.respuestasAudicion) ? arg1.respuestasAudicion : [];
    rondaActual = arg1.rondaActual || 1;
    rondaCerrada = Boolean(arg1.rondaCerrada);
    soloLectura = Boolean(arg1.soloLectura);
    audicionActualNum = arg1.audicionActual || 1;
    const configRonda = CONFIG.ROUNDS[rondaActual] || { audiciones: 4 };
    totalAudiciones = configRonda.audiciones;
  } else {
    alumnos = Array.isArray(arg1) ? arg1 : [];
    resultados = Array.isArray(arg2) ? arg2 : [];
    const select = DOM.get('selectRonda');
    if (select) rondaActual = parseInt(select.value, 10) || 1;
    const audEl = DOM.get('audicionNumero');
    if (audEl) audicionActualNum = parseInt(audEl.textContent, 10) || 1;
    const configRonda = CONFIG.ROUNDS[rondaActual] || { audiciones: 4 };
    totalAudiciones = configRonda.audiciones;
  }

  const container = DOM.get('listaAlumnos');
  if (!container) return;

  // Mapear resultados de la ronda actual y eliminaciones previas
  const resMap = {};
  const eliminacionesMap = {};

  resultados.forEach(res => {
    if (parseInt(res.ronda, 10) === rondaActual) {
      resMap[String(res.alumnoId)] = res;
    }
    if (res.eliminado) {
      const rElim = res.rondaEliminacion || res.ronda;
      if (!eliminacionesMap[String(res.alumnoId)] || rElim < eliminacionesMap[String(res.alumnoId)]) {
        eliminacionesMap[String(res.alumnoId)] = rElim;
      }
    }
  });

  alumnos = alumnos.filter(alumno => {
    const rawRound = alumno.rondaEliminacion || eliminacionesMap[String(alumno.id)];
    const eliminationRound = Number(rawRound);
    return !Number.isInteger(eliminationRound) || eliminationRound >= rondaActual;
  });

  if (alumnos.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8 text-blue-200">
        <p class="text-lg">No hay participantes que hayan clasificado a esta ronda.</p>
      </div>
    `;
    return;
  }

  const configRonda = CONFIG.ROUNDS[rondaActual] || { minimoPasar: 2 };
  const minPasar = configRonda.minimoPasar;
  const respuestasRonda = respuestasAudicion.filter(response => Number(response.ronda) === Number(rondaActual));

  container.innerHTML = alumnos.map(alumno => {
    const res = resMap[String(alumno.id)];
    const respuestasAlumno = respuestasRonda.filter(response => String(response.alumnoId) === String(alumno.id));
    const aciertosPrevios = respuestasAlumno.length > 0
      ? respuestasAlumno.filter(response => response.correcto === true || String(response.correcto).toLowerCase() === 'true').length
      : (res ? parseInt(res.aciertos, 10) : 0);
    
    // Determinar si fue eliminado en una ronda anterior o en esta ronda
    const rEliminacion = alumno.rondaEliminacion || eliminacionesMap[String(alumno.id)];
    const eliminadoAnteriormente = rEliminacion && rEliminacion < rondaActual;
    const eliminadoEstaRonda = res ? res.eliminado : false;
    const eliminado = eliminadoAnteriormente || eliminadoEstaRonda;

    const nombreFormat = formatNombre(alumno.nombre);

    // Estado visual del alumno
    let badgeClass = 'bg-blue-900/60 text-blue-200 border border-blue-400/30';
    let estadoTexto = 'En competencia';

    if (eliminadoAnteriormente) {
      badgeClass = 'bg-rose-950 text-rose-300 border border-rose-800';
      estadoTexto = `❌ Eliminado en Ronda ${rEliminacion}`;
    } else if (eliminadoEstaRonda) {
      badgeClass = 'bg-red-900/80 text-red-200 border border-red-500';
      estadoTexto = `Eliminado en Ronda ${rondaActual}`;
    } else if (aciertosPrevios >= minPasar) {
      badgeClass = 'bg-emerald-900/80 text-emerald-200 border border-emerald-500';
      estadoTexto = `Clasificado (${aciertosPrevios}/${totalAudiciones})`;
    }

    // Checkboxes para cada audición de la ronda
    let checkboxesHtml = '';
    for (let audNum = 1; audNum <= totalAudiciones; audNum++) {
      const audicionRespuesta = respuestasAlumno.find(response => Number(response.audicionNum) === audNum);
      const isChecked = audicionRespuesta && (audicionRespuesta.correcto === true || String(audicionRespuesta.correcto).toLowerCase() === 'true');
      const isAudicionActual = audNum === audicionActualNum;
      const isDisabled = soloLectura || rondaCerrada || eliminadoAnteriormente || !isAudicionActual;

      checkboxesHtml += `
        <label class="flex flex-col items-center justify-center cursor-pointer p-1.5 rounded-lg border transition select-none ${isAudicionActual ? 'bg-yellow-500/20 border-yellow-400 shadow-md ring-1 ring-yellow-400' : 'bg-blue-950/60 hover:bg-blue-900 border-blue-700/50'}">
          <span class="text-xs ${isAudicionActual ? 'text-yellow-300 font-extrabold' : 'text-slate-300'} mb-1">Aud ${audNum}</span>
          <input 
            type="checkbox" 
            class="checkbox-acierto w-5 h-5 text-yellow-500 bg-blue-900 rounded border-gray-400 focus:ring-yellow-400 focus:ring-2 cursor-pointer"
            data-alumno-id="${sanitizeInput(alumno.id)}"
            data-audicion="${audNum}"
            ${isChecked ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}
          />
          <span class="text-[9px] ${audicionRespuesta ? (isChecked ? 'text-emerald-300' : 'text-rose-300') : 'text-slate-500'}">${audicionRespuesta ? (isChecked ? 'Correcta' : 'Error') : 'Pendiente'}</span>
        </label>
      `;
    }

    return `
      <div class="alumno-card bg-slate-800/90 border border-slate-700 rounded-xl p-4 shadow-md transition hover:border-yellow-500/50 ${eliminadoAnteriormente ? 'opacity-40 bg-slate-950 cursor-not-allowed' : ''}" data-alumno-card="${sanitizeInput(alumno.id)}">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-bold text-base md:text-lg text-white">${sanitizeInput(nombreFormat)}</h3>
            <p class="text-xs text-slate-300">${sanitizeInput(alumno.grado || '')} ${sanitizeInput(alumno.nivel || '')}</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium ${badgeClass}">
            ${estadoTexto}
          </span>
        </div>

        <!-- Checkboxes de audiciones -->
        <div class="mt-2">
          <div class="text-xs text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Aciertos Ronda ${rondaActual}:</span>
            <span class="font-bold text-yellow-400"><span id="aciertos-count-${alumno.id}">${aciertosPrevios}</span> / ${totalAudiciones}</span>
          </div>
          <div class="grid grid-cols-${Math.min(totalAudiciones, 4)} gap-1.5">
            ${checkboxesHtml}
          </div>
        </div>

        <!-- Entrada rápida de respuesta de pizarra para el jurado -->
        ${!eliminadoAnteriormente ? `
          <div class="mt-3 pt-2 border-t border-slate-700/60 flex items-center gap-2">
            <span class="text-xs text-slate-400 whitespace-nowrap">✏️ Pizarra:</span>
            <input 
              type="text" 
              placeholder="Código escrito (ej: TP2380)"
              class="input-pizarra-alumno bg-slate-950 text-yellow-300 border border-slate-700 uppercase font-mono text-xs px-2.5 py-1 rounded-lg w-full focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              data-alumno-id="${sanitizeInput(alumno.id)}"
              data-audicion="${audicionActualNum}"
              ${soloLectura || rondaCerrada ? 'disabled' : ''}
              value="${sanitizeInput(respuestasAlumno.find(response => Number(response.audicionNum) === audicionActualNum)?.respuesta || '')}"
            />
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

/**
 * Renderiza la lista de audiciones programadas para la ronda y actualiza la tarjeta de validación de código
 */
export function renderAudiciones(arg1, arg2) {
  let audiciones = [];
  let ronda = 1;
  let audicionActualNum = 1;
  let soloLectura = false;

  if (arg1 && arg1.rondaActual !== undefined) {
    ronda = arg1.rondaActual;
    audiciones = arg1.audicionesRonda || arg1.audiciones || [];
    audicionActualNum = arg1.audicionActual || 1;
    soloLectura = Boolean(arg1.soloLectura);
  } else {
    audiciones = Array.isArray(arg1) ? arg1 : [];
    ronda = arg2 || 1;
    const audEl = DOM.get('audicionNumero');
    if (audEl) audicionActualNum = parseInt(audEl.textContent, 10) || 1;
  }

  const audicionNumEl = DOM.get('audicionNumero');
  if (audicionNumEl) {
    audicionNumEl.textContent = String(audicionActualNum);
  }

  // Buscar audición actual para mostrar el código de validación al jurado
  const audData = audiciones.find(a => a.audicionNum === audicionActualNum) || audiciones[audicionActualNum - 1];
  
  const nombreEl = document.getElementById('admin-cancion-nombre');
  const codigoEl = document.getElementById('admin-cancion-codigo');
  const duracionEl = document.getElementById('admin-seg-duracion');

  const configRonda = CONFIG.ROUNDS[ronda] || { duracion: 40, audiciones: 4 };
  const badgeRango = document.getElementById('badge-rango-reproduccion');
  if (badgeRango) {
    badgeRango.textContent = `📍 Rango: de 0s a ${configRonda.duracion || 40}s`;
  }

  if (nombreEl) {
    nombreEl.textContent = audData ? (audData.cancionNombre || `Composición #${audData.cancionId}`) : 'Composición no asignada';
  }
  if (codigoEl) {
    codigoEl.textContent = audData ? (audData.cancionCodigo || '----') : '----';
  }
  if (duracionEl) {
    duracionEl.textContent = String(configRonda.duracion || 40);
  }

  // Si existe un contenedor adicional de info de la ronda
  const infoContainer = document.getElementById('ronda-info-detalles');
  if (infoContainer) {
    infoContainer.innerHTML = `
      <div class="flex flex-wrap items-center justify-between text-xs md:text-sm bg-blue-950/70 p-3 rounded-lg border border-blue-700/60 mt-3 gap-2">
        <span>⏱ <strong>Duración:</strong> ${configRonda.duracion || 40}s por audición</span>
        <span>🎯 <strong>Mínimo para clasificar:</strong> ${configRonda.minimoPasar || 2} aciertos</span>
        <span>🎼 <strong>Total audiciones:</strong> ${configRonda.audiciones || 4}</span>
        ${soloLectura ? '<span class="font-bold text-cyan-300">Consulta histórica · solo lectura</span>' : ''}
      </div>
    `;
  }
}

/**
 * Renderiza la tabla completa del ranking
 */
export function renderRanking(ranking) {
  const content = DOM.get('rankingContent');
  if (!content) return;

  if (!ranking || ranking.length === 0) {
    content.innerHTML = `
      <div class="text-center py-6 text-slate-300">
        <p>Aún no hay puntajes registrados en el certamen.</p>
      </div>
    `;
    return;
  }

  const podiumHtml = renderTopTres(ranking.filter((item, index) => getRankPosition(item, index) <= 3));

  const rowsHtml = ranking.map((item, idx) => {
    const pos = getRankPosition(item, idx);
    let posBadge = `<span class="font-bold text-slate-300">${formatRanking(pos)}</span>`;
    let rowClass = 'hover:bg-slate-700/50';

    if (pos === 1) {
      posBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black shadow-lg">🥇 1°</span>`;
      rowClass = 'bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500';
    } else if (pos === 2) {
      posBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black shadow-lg">🥈 2°</span>`;
      rowClass = 'bg-slate-300/10 hover:bg-slate-300/20 border-l-4 border-slate-300';
    } else if (pos === 3) {
      posBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black shadow-lg">🥉 3°</span>`;
      rowClass = 'bg-amber-700/10 hover:bg-amber-700/20 border-l-4 border-amber-600';
    }

    const estadoDetalle = item.eliminado 
      ? `Eliminado en Ronda ${item.rondaEliminacion || 1}` 
      : `Activo (Ronda ${item.rondaMax || 1})`;
    const trayectoria = renderTrayectoriaRondas(item);

    return `
      <tr class="border-b border-slate-700/60 ${rowClass} transition-colors">
        <td class="p-3 text-center">${posBadge}</td>
        <td class="p-3 font-semibold text-white">
          ${sanitizeInput(formatNombre(item.nombre))}
          ${item.premio ? `<span class="block text-xs text-yellow-400 font-normal">🎁 ${item.premio}</span>` : ''}
        </td>
        <td class="p-3 text-slate-300 text-sm">${sanitizeInput(item.grado || '')} ${sanitizeInput(item.nivel || '')}</td>
        <td class="p-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${item.eliminado ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}">
            ${estadoDetalle}
          </span>
        </td>
        <td class="p-3">
          <div class="flex flex-wrap gap-1">${trayectoria}</div>
        </td>
        <td class="p-3 text-right font-bold text-yellow-400 text-lg">
          ${item.puntosTotal || 0}
        </td>
      </tr>
    `;
  }).join('');

  content.innerHTML = `
    ${podiumHtml}

    <div class="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/80 shadow-xl mt-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-950 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700">
            <th class="p-3 text-center w-16">Puesto</th>
            <th class="p-3">Participante</th>
            <th class="p-3">Grado</th>
            <th class="p-3 text-center">Estado del Participante</th>
            <th class="p-3">Trayectoria por rondas</th>
            <th class="p-3 text-right">Puntos Totales</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

function getRankPosition(item, index) {
  const position = Number(item.posicion);
  return Number.isInteger(position) && position > 0 ? position : index + 1;
}

function renderTrayectoriaRondas(item) {
  const details = item.detalleRondas || {};
  return Array.from({ length: CONFIG.TOTAL_RONDAS }, (_, index) => {
    const round = index + 1;
    const key = `ronda_${round}`;
    const reached = Object.prototype.hasOwnProperty.call(details, key);
    if (!reached) {
      if (round <= Number(item.rondaMax || 0)) {
        return `<span class="rounded-md bg-cyan-950 px-2 py-1 text-[10px] text-cyan-200" title="Llegó a la Ronda ${round}; aún no registra puntaje">R${round} en curso</span>`;
      }
      return `<span class="rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-500" title="No llegó a la Ronda ${round}">R${round} —</span>`;
    }

    const score = sanitizeInput(details[key]);
    const total = CONFIG.ROUNDS[round] ? CONFIG.ROUNDS[round].audiciones : '?';
    return `<span class="rounded-md bg-emerald-950 px-2 py-1 text-[10px] text-emerald-200" title="Aciertos en Ronda ${round}">R${round} ${score}/${total}</span>`;
  }).join('');
}

/**
 * Renderiza el podio visual TOP 3
 */
export function renderTopTres(topTres) {
  if (!topTres || topTres.length === 0) return '';

  const styles = {
    1: { medal: '🥇', className: 'border-yellow-400 bg-yellow-950/50 text-yellow-200' },
    2: { medal: '🥈', className: 'border-slate-300 bg-slate-800/80 text-slate-200' },
    3: { medal: '🥉', className: 'border-amber-600 bg-amber-950/50 text-amber-200' }
  };
  const columns = [2, 1, 3].map(position => {
    const members = topTres.filter((item, index) => getRankPosition(item, index) === position);
    const style = styles[position];
    if (members.length === 0) return '<div class="min-h-24"></div>';

    return `
      <div class="rounded-t-2xl border-2 ${style.className} p-4 text-center shadow-xl">
        <div class="mb-3 text-3xl">${style.medal} <span class="text-xl font-black">${position}°</span></div>
        <div class="space-y-3">
          ${members.map(item => `
            <div class="rounded-xl bg-slate-950/50 p-3">
              <p class="font-extrabold text-white">${sanitizeInput(formatNombre(item.nombre))}</p>
              <p class="text-xs text-slate-300">${sanitizeInput(item.grado || '')}</p>
              <p class="mt-1 font-black text-yellow-300">${Number(item.puntosTotal) || 0} pts</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `<div class="podium-container grid grid-cols-1 md:grid-cols-3 items-end gap-3 md:gap-6 my-8 px-2 max-w-4xl mx-auto">${columns}</div>`;
}

/**
 * Actualiza el display del timer
 */
export function renderTimer(timeLeft, total = 40) {
  const display = DOM.get('timerDisplay');
  if (!display) return;

  display.textContent = timeLeft;

  if (timeLeft <= 3 && timeLeft > 0) {
    display.className = 'text-7xl md:text-8xl font-black text-red-500 mb-4 animate-ping';
  } else if (timeLeft <= 5 && timeLeft > 0) {
    display.className = 'text-7xl md:text-8xl font-black text-red-400 mb-4 animate-pulse';
  } else if (timeLeft <= 10 && timeLeft > 0) {
    display.className = 'text-7xl md:text-8xl font-bold text-amber-400 mb-4';
  } else {
    display.className = 'text-7xl md:text-8xl font-bold text-yellow-400 mb-4';
  }
}

/**
 * Muestra información de la ronda actual
 */
export function renderEstadoRonda(ronda, config) {
  const select = DOM.get('selectRonda');
  if (select && select.value !== String(ronda)) {
    select.value = String(ronda);
  }
}
