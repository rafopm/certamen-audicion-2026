/**
 * Panel de Configuración Amigable para el Administrador del Certamen.
 * Permite:
 * 1. Sorteo aleatorio de canciones por ronda.
 * 2. Gestión de canciones (agregar, editar, eliminar).
 * 3. Gestión de participantes (carga masiva desde Excel/texto, eliminación).
 * 4. Configuración de parámetros de rondas, duraciones, mínimos y premios.
 */
import { DOM } from './dom.js';
import { api } from '../services/api.js';
import { appState } from '../core/state.js';
import { CONFIG } from '../config.js';
import { renderAlumnos, renderAudiciones } from './render.js';
import { extractDriveId } from '../utils/validators.js';

let modalElement = null;
let currentTab = 'sorteo';
let cancionesTemp = [];
let audicionesSorteoTemp = [];
let alumnosTemp = [];
let configTemp = {};

/**
 * Inicializa el Panel de Configuración y sus botones
 */
export function initConfigPanel() {
  crearModalHTML();

  const btnOpen = document.getElementById('btn-abrir-config');
  if (btnOpen) {
    btnOpen.addEventListener('click', abrirPanelConfig);
  }
}

/**
 * Inyecta el modal en el DOM si aún no existe
 */
function crearModalHTML() {
  if (document.getElementById('modal-configuracion')) return;

  const modal = document.createElement('div');
  modal.id = 'modal-configuracion';
  modal.className = 'fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 transition-opacity duration-300 hidden opacity-0';

  modal.innerHTML = `
    <div class="bg-slate-900 border border-yellow-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-white">
      
      <!-- Header del Panel -->
      <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-4 md:p-5 border-b border-slate-800 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">⚙️</span>
          <div>
            <h2 class="text-xl md:text-2xl font-black text-yellow-400 font-display">
              Panel de Configuración del Certamen
            </h2>
            <p class="text-xs text-slate-300">
              Personaliza el sorteo de canciones, participantes, rondas y parámetros
            </p>
          </div>
        </div>
        <button id="btn-cerrar-config" class="text-slate-400 hover:text-white text-2xl font-black px-3 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Barra de Pestañas / Tabs -->
      <div class="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto text-xs md:text-sm font-bold">
        <button class="tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="sorteo">
          <span>🎲</span>
          <span>Sorteo de Canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="canciones">
          <span>🎵</span>
          <span>Canciones</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="participantes">
          <span>👥</span>
          <span>Participantes (Carga Masiva)</span>
        </button>
        <button class="tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer" data-tab="rondas">
          <span>⏱</span>
          <span>Rondas y Reglas</span>
        </button>
      </div>

      <!-- Contenedor del Cuerpo de la Pestaña -->
      <div id="config-tab-content" class="p-4 md:p-6 overflow-y-auto flex-1 text-sm">
        <!-- Render dinámico según tab -->
      </div>

      <!-- Footer del Modal -->
      <div class="bg-slate-950 p-3 md:p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>💡 Todos los cambios se sincronizan en Google Sheets</span>
        <button id="btn-cerrar-config-footer" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer">
          Cerrar
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);
  modalElement = modal;

  // Eventos de cerrar
  modal.querySelector('#btn-cerrar-config').addEventListener('click', cerrarPanelConfig);
  modal.querySelector('#btn-cerrar-config-footer').addEventListener('click', cerrarPanelConfig);

  // Eventos de tabs
  modal.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      cambiarTab(tab);
    });
  });
}

/**
 * Abre el modal y carga los datos actuales del certamen
 */
export async function abrirPanelConfig() {
  if (!modalElement) crearModalHTML();

  DOM.showLoading('Cargando configuraciones...');
  try {
    const [cfgRes, cancionesRes, alumnosRes, audRes] = await Promise.all([
      api.getConfig().catch(() => ({ data: {} })),
      api.getCanciones().catch(() => ({ data: [] })),
      api.getAlumnos().catch(() => ({ data: [] })),
      api.getAudicionesRonda(1).catch(() => ({ data: [] }))
    ]);

    configTemp = cfgRes.data || {};
    cancionesTemp = cancionesRes.data || [];
    alumnosTemp = alumnosRes.data || [];

    // Cargar todas las audiciones de las 5 rondas
    const audicionesTodas = [];
    for (let r = 1; r <= 5; r++) {
      try {
        const rAud = await api.getAudicionesRonda(r);
        (rAud.data || []).forEach(a => audicionesTodas.push(a));
      } catch (e) {}
    }
    audicionesSorteoTemp = audicionesTodas;

    modalElement.classList.remove('hidden');
    setTimeout(() => modalElement.classList.remove('opacity-0'), 10);

    renderTabActual();
  } catch (err) {
    console.error('Error al abrir configuración:', err);
    DOM.showToast('Error al cargar datos de configuración', 'error');
  } finally {
    DOM.hideLoading();
  }
}

/**
 * Cierra el modal de configuración
 */
export function cerrarPanelConfig() {
  if (!modalElement) return;
  modalElement.classList.add('opacity-0');
  setTimeout(() => modalElement.classList.add('hidden'), 250);
}

/**
 * Cambia la pestaña activa
 */
function cambiarTab(tab) {
  currentTab = tab;
  modalElement.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.className = 'tab-btn px-4 py-3 border-b-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'tab-btn px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 whitespace-nowrap cursor-pointer';
    }
  });

  renderTabActual();
}

/**
 * Renderiza el contenido del tab seleccionado
 */
function renderTabActual() {
  const container = document.getElementById('config-tab-content');
  if (!container) return;

  switch (currentTab) {
    case 'sorteo':
      renderTabSorteo(container);
      break;
    case 'canciones':
      renderTabCanciones(container);
      break;
    case 'participantes':
      renderTabParticipantes(container);
      break;
    case 'rondas':
      renderTabRondas(container);
      break;
  }
}

// ==============================================================================
// TAB 1: SORTEO ALEATORIO DE CANCIONES
// ==============================================================================
function renderTabSorteo(container) {
  const cancionesActivas = cancionesTemp.filter(c => c.activa !== false);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-base text-yellow-300 flex items-center gap-2">
          <span>🎲</span> Sorteo Aleatorio de Repertorio por Rondas
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Distribuye al azar las canciones disponibles en cada una de las 5 rondas, garantizando que no se repitan dentro de la misma ronda. Puedes pulsar el botón tantas veces como quieras para ver diferentes combinaciones y guardar la definitiva.
        </p>
        <div class="mt-3 flex flex-wrap gap-3">
          <button id="btn-generar-sorteo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>🎲</span>
            <span>Generar Nuevo Sorteo Aleatorio</span>
          </button>
          <button id="btn-guardar-sorteo" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer">
            <span>💾</span>
            <span>Guardar Sorteo en Google Sheets</span>
          </button>
        </div>
      </div>

      <div class="text-xs text-slate-400 flex items-center justify-between">
        <span>Canciones activas para el sorteo: <strong class="text-white">${cancionesActivas.length}</strong></span>
        <span>Total audiciones programadas: <strong class="text-white">${audicionesSorteoTemp.length || 17}</strong></span>
      </div>

      <!-- Tabla previa del sorteo -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[50vh]">
        <table class="w-full text-left text-xs md:text-sm">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
              <th class="p-2.5 text-center w-16">Ronda</th>
              <th class="p-2.5 text-center w-20">Audición</th>
              <th class="p-2.5">Obra Asignada</th>
              <th class="p-2.5 text-center w-28">Código</th>
              <th class="p-2.5 text-center w-24">Duración</th>
            </tr>
          </thead>
          <tbody id="sorteo-preview-body">
            ${generarFilasSorteoHTML(audicionesSorteoTemp)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Evento: Generar Sorteo Aleatorio
  container.querySelector('#btn-generar-sorteo').addEventListener('click', () => {
    if (cancionesActivas.length === 0) {
      DOM.showToast('No hay canciones activas para sortear', 'error');
      return;
    }

    const config = configTemp;
    const nuevasAudiciones = [];
    let ordenGlobal = 1;

    for (let r = 1; r <= 5; r++) {
      const suffix = r === 5 ? 'FINAL' : String(r);
      const numAud = config[`NUM_AUDICIONES_RONDA_${suffix}`] || (r <= 2 ? 4 : 3);
      
      // Barajar canciones activas (Fisher-Yates)
      const pool = [...cancionesActivas].sort(() => Math.random() - 0.5);

      for (let a = 1; a <= numAud; a++) {
        const cancion = pool[(a - 1) % pool.length];
        nuevasAudiciones.push({
          ronda: r,
          audicionNum: a,
          cancionId: cancion.id,
          cancionNombre: cancion.nombre,
          cancionCodigo: cancion.codigo,
          orden: ordenGlobal++
        });
      }
    }

    audicionesSorteoTemp = nuevasAudiciones;
    document.getElementById('sorteo-preview-body').innerHTML = generarFilasSorteoHTML(nuevasAudiciones);
    DOM.showToast('¡Nuevo sorteo aleatorio generado con éxito!', 'success', 2500);
  });

  // Evento: Guardar Sorteo en Google Sheets
  container.querySelector('#btn-guardar-sorteo').addEventListener('click', async () => {
    if (audicionesSorteoTemp.length === 0) {
      DOM.showToast('Genera un sorteo antes de guardar', 'warning');
      return;
    }

    DOM.showLoading('Guardando orden de audiciones en Google Sheets...');
    try {
      await api.guardarAudicionesRonda(audicionesSorteoTemp);
      
      // Actualizar estado global y vista principal
      const state = appState.get();
      const rondaActual = state.rondaActual || 1;
      const rAudRes = await api.getAudicionesRonda(rondaActual);
      appState.set({ audicionesRonda: rAudRes.data || [] });
      renderAudiciones(appState.get());

      DOM.showToast('✅ Sorteo de canciones guardado correctamente en la nube', 'success');
    } catch (err) {
      console.error('Error al guardar sorteo:', err);
      DOM.showToast('Error al guardar sorteo: ' + err.message, 'error');
    } finally {
      DOM.hideLoading();
    }
  });
}

function generarFilasSorteoHTML(audiciones) {
  if (!audiciones || audiciones.length === 0) {
    return `<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay sorteo cargado. Pulsa "Generar Nuevo Sorteo Aleatorio".</td></tr>`;
  }

  const duraciones = { 1: '40s', 2: '20s', 3: '10s', 4: '5s', 5: '2s' };

  return audiciones.map((aud, idx) => `
    <tr class="border-b border-slate-800/80 hover:bg-slate-800/40">
      <td class="p-2.5 text-center font-bold text-yellow-400">R${aud.ronda}</td>
      <td class="p-2.5 text-center text-slate-300">Aud ${aud.audicionNum}</td>
      <td class="p-2.5 font-semibold text-white">${aud.cancionNombre || `Composición #${aud.cancionId}`}</td>
      <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${aud.cancionCodigo || '----'}</td>
      <td class="p-2.5 text-center text-slate-400">${duraciones[aud.ronda] || '40s'}</td>
    </tr>
  `).join('');
}

// ==============================================================================
// TAB 2: GESTIÓN DE CANCIONES
// ==============================================================================
function renderTabCanciones(container) {
  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Formulario para Agregar Canción -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">➕ Agregar Nueva Composición de Strauss</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input type="text" id="add-cancion-nombre" placeholder="Nombre (ej: SANGRE VIENESA)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-codigo" placeholder="Código (ej: SV1200)" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase font-mono focus:ring-1 focus:ring-yellow-400 focus:outline-none">
          <input type="text" id="add-cancion-drive" placeholder="ID de Google Drive o enlace" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-yellow-400 focus:outline-none">
        </div>
        <div class="mt-2.5 flex justify-end">
          <button id="btn-add-cancion" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs shadow transition cursor-pointer">
            + Agregar a la Lista
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-400">Total canciones en repertorio: <strong class="text-white">${cancionesTemp.length}</strong></span>
        <button id="btn-guardar-todas-canciones" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar Canciones en Google Sheets
        </button>
      </div>

      <!-- Tabla de Canciones -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[45vh]">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <th class="p-2.5 text-center w-12">ID</th>
              <th class="p-2.5">Título de la Obra</th>
              <th class="p-2.5 text-center w-24">Código</th>
              <th class="p-2.5">ID Google Drive</th>
              <th class="p-2.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody id="canciones-list-body">
            ${cancionesTemp.map((c, i) => `
              <tr class="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td class="p-2.5 text-center font-bold text-yellow-400">${c.id || i + 1}</td>
                <td class="p-2.5 font-semibold text-white">${c.nombre || ''}</td>
                <td class="p-2.5 text-center font-mono font-bold text-yellow-300">${c.codigo || ''}</td>
                <td class="p-2.5 font-mono text-slate-400 truncate max-w-xs">${c.driveId || c.archivoDriveId || '<span class="text-amber-500">Sin ID</span>'}</td>
                <td class="p-2.5 text-center">
                  <button class="btn-eliminar-cancion text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-rose-950/50 transition cursor-pointer" data-id="${c.id}">
                    🗑
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;

  // Evento: Agregar Canción a la lista temporal
  container.querySelector('#btn-add-cancion').addEventListener('click', () => {
    const nombre = container.querySelector('#add-cancion-nombre').value.trim();
    const codigo = container.querySelector('#add-cancion-codigo').value.trim();
    const driveInput = container.querySelector('#add-cancion-drive').value.trim();
    const cleanId = extractDriveId(driveInput);

    if (!nombre) {
      DOM.showToast('Ingresa el nombre de la obra', 'warning');
      return;
    }

    const nextId = cancionesTemp.length > 0 ? Math.max(...cancionesTemp.map(c => Number(c.id) || 0)) + 1 : 1;
    cancionesTemp.push({
      id: nextId,
      nombre: nombre.toUpperCase(),
      codigo: codigo.toUpperCase() || `ST${nextId.toString().padStart(4, '0')}`,
      driveId: cleanId,
      archivoDriveId: cleanId,
      anio: 2026,
      activa: true
    });

    renderTabCanciones(container);
    DOM.showToast(`Obra "${nombre}" agregada a la lista`, 'info', 2000);
  });

  // Evento: Eliminar Canción individual
  container.querySelectorAll('.btn-eliminar-cancion').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      cancionesTemp = cancionesTemp.filter(c => String(c.id) !== String(id));
      renderTabCanciones(container);
    });
  });

  // Evento: Guardar Canciones en Google Sheets
  container.querySelector('#btn-guardar-todas-canciones').addEventListener('click', async () => {
    DOM.showLoading('Guardando lista de canciones en Google Sheets...');
    try {
      await api.guardarCanciones(cancionesTemp);
      appState.set({ canciones: cancionesTemp });
      DOM.showToast('✅ Lista de canciones guardada exitosamente en la nube', 'success');
    } catch (err) {
      DOM.showToast('Error al guardar canciones: ' + err.message, 'error');
    } finally {
      DOM.hideLoading();
    }
  });
}

// ==============================================================================
// TAB 3: PARTICIPANTES Y CARGA MASIVA
// ==============================================================================
function renderTabParticipantes(container) {
  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Sección de Carga Masiva -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 flex items-center gap-2">
          <span>📥</span> Carga Masiva de Alumnos (Pega desde Excel o texto)
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Pega los participantes directamente en formato: <strong>Nombre, Grado, Nivel</strong> (uno por línea o tabulado desde Excel).
        </p>
        <textarea 
          id="textarea-alumnos-masivo" 
          rows="4" 
          placeholder="Ejemplo:&#10;Valeria Sánchez, 5to, Primaria&#10;Mateo Quispe, 6to, Primaria&#10;Camila Flores, 1ro, Secundaria"
          class="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:ring-1 focus:ring-yellow-400 focus:outline-none"
        ></textarea>
        
        <div class="mt-3 flex flex-wrap justify-between items-center gap-2">
          <label class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" id="chk-reemplazar-alumnos" class="w-4 h-4 text-yellow-500 rounded bg-slate-900 border-slate-700">
            <span>Reemplazar toda la lista actual</span>
          </label>
          <div class="flex gap-2">
            <button id="btn-importar-masivo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
              📥 Importar Alumnos
            </button>
            <button id="btn-vaciar-alumnos" class="bg-rose-800 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer">
              🗑 Vaciar Lista
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-400">Total participantes registrados: <strong class="text-white">${alumnosTemp.length}</strong></span>
        <button id="btn-guardar-alumnos-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer">
          💾 Guardar Alumnos en Google Sheets
        </button>
      </div>

      <!-- Tabla de Participantes -->
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-[42vh]">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <th class="p-2.5 text-center w-12">ID</th>
              <th class="p-2.5">Nombre Completo</th>
              <th class="p-2.5">Grado</th>
              <th class="p-2.5">Nivel</th>
              <th class="p-2.5 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody id="alumnos-list-body">
            ${alumnosTemp.map((al, idx) => `
              <tr class="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td class="p-2.5 text-center font-bold text-yellow-400">${al.id || idx + 1}</td>
                <td class="p-2.5 font-semibold text-white">${al.nombre || ''}</td>
                <td class="p-2.5 text-slate-300">${al.grado || ''}</td>
                <td class="p-2.5 text-slate-400">${al.nivel || ''}</td>
                <td class="p-2.5 text-center">
                  <button class="btn-eliminar-alumno text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded hover:bg-rose-950/50 transition cursor-pointer" data-id="${al.id}">
                    🗑
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;

  // Evento: Importar Alumnos Masivamente
  container.querySelector('#btn-importar-masivo').addEventListener('click', () => {
    const rawText = container.querySelector('#textarea-alumnos-masivo').value.trim();
    if (!rawText) {
      DOM.showToast('Pega al menos una línea con datos de alumnos', 'warning');
      return;
    }

    const reemplazar = container.querySelector('#chk-reemplazar-alumnos').checked;
    const lineas = rawText.split('\n');
    const nuevosAlumnos = [];
    let startId = reemplazar ? 1 : (alumnosTemp.length > 0 ? Math.max(...alumnosTemp.map(a => Number(a.id) || 0)) + 1 : 1);

    lineas.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Separar por coma o por tabulación (copiado desde Excel)
      const partes = trimmed.includes('\t') ? trimmed.split('\t') : trimmed.split(',');
      const nombre = (partes[0] || '').trim();
      const grado = (partes[1] || '').trim();
      const nivel = (partes[2] || '').trim();

      if (nombre) {
        nuevosAlumnos.push({
          id: startId++,
          nombre: nombre,
          grado: grado || '',
          nivel: nivel || '',
          anio: 2026,
          activo: true
        });
      }
    });

    if (reemplazar) {
      alumnosTemp = nuevosAlumnos;
    } else {
      alumnosTemp = [...alumnosTemp, ...nuevosAlumnos];
    }

    renderTabParticipantes(container);
    DOM.showToast(`Se procesaron ${nuevosAlumnos.length} participantes`, 'success');
  });

  // Evento: Vaciar lista de alumnos
  container.querySelector('#btn-vaciar-alumnos').addEventListener('click', () => {
    if (confirm('¿Deseas vaciar la lista temporal de participantes?')) {
      alumnosTemp = [];
      renderTabParticipantes(container);
    }
  });

  // Evento: Eliminar Alumno individual
  container.querySelectorAll('.btn-eliminar-alumno').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      alumnosTemp = alumnosTemp.filter(a => String(a.id) !== String(id));
      renderTabParticipantes(container);
    });
  });

  // Evento: Guardar Alumnos en Google Sheets
  container.querySelector('#btn-guardar-alumnos-cloud').addEventListener('click', async () => {
    DOM.showLoading('Guardando participantes en Google Sheets...');
    try {
      await api.guardarAlumnosLote(alumnosTemp, true);
      appState.set({ alumnos: alumnosTemp });
      renderAlumnos(appState.get());
      DOM.showToast('✅ Participantes guardados exitosamente en la nube', 'success');
    } catch (err) {
      DOM.showToast('Error al guardar participantes: ' + err.message, 'error');
    } finally {
      DOM.hideLoading();
    }
  });
}

// ==============================================================================
// TAB 4: RONDAS Y PARÁMETROS DEL CERTAMEN
// ==============================================================================
function renderTabRondas(container) {
  const cfg = configTemp;

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Datos Generales del Evento -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-3">🏛 Datos Oficiales del Evento</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-slate-300 mb-1">Nombre Oficial del Evento:</label>
            <input type="text" id="cfg-nombre-evento" value="${cfg.NOMBRE_EVENTO || 'Certamen Audición Musical 2026'}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Compositor Homenajeado:</label>
            <input type="text" id="cfg-homenajeado" value="${cfg.HOMENAJEADO || 'Johann Strauss'}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">Año del Certamen:</label>
            <input type="number" id="cfg-anio" value="${cfg.ANIO_CERTAMEN || 2026}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
          </div>
        </div>
      </div>

      <!-- Configuración de las 5 Rondas -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">⏱ Configuración de Parámetros por Ronda</h3>
        <p class="text-xs text-slate-400 mb-3">Define la duración en segundos, cantidad de audiciones y mínimo de aciertos para clasificar en cada fase.</p>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          ${[1, 2, 3, 4, 5].map(r => {
            const suffix = r === 5 ? 'FINAL' : String(r);
            const dur = cfg[`DURACION_RONDA_${suffix}`] || (r === 1 ? 40 : (r === 2 ? 20 : (r === 3 ? 10 : (r === 4 ? 5 : 2))));
            const aud = cfg[`NUM_AUDICIONES_RONDA_${suffix}`] || (r <= 2 ? 4 : 3);
            const min = cfg[`MINIMO_PASAR_RONDA_${suffix}`] || (r === 5 ? 3 : 2);

            return `
              <div class="bg-slate-900/90 border border-slate-700 p-3 rounded-xl space-y-2">
                <span class="font-bold text-yellow-400 block text-center border-b border-slate-700 pb-1">
                  ${r === 5 ? 'Ronda Final' : `Ronda ${r}`}
                </span>
                <div>
                  <label class="text-[10px] text-slate-400 block">Duración (seg):</label>
                  <input type="number" id="cfg-dur-${r}" value="${dur}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Audiciones:</label>
                  <input type="number" id="cfg-aud-${r}" value="${aud}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-white">
                </div>
                <div>
                  <label class="text-[10px] text-slate-400 block">Mínimo clasificar:</label>
                  <input type="number" id="cfg-min-${r}" value="${min}" class="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center font-bold text-yellow-300">
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Premios -->
      <div class="bg-blue-950/60 border border-blue-800 p-4 rounded-xl">
        <h3 class="font-bold text-sm text-yellow-300 mb-2">🎁 Premios Oficiales</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">🥇 Primer Puesto:</label>
            <input type="text" id="cfg-premio-1" value="${cfg.PREMIOS_PRIMER_PUESTO || 'Diploma, medalla y premio sorpresa'}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥈 Segundo Puesto:</label>
            <input type="text" id="cfg-premio-2" value="${cfg.PREMIOS_SEGUNDO_PUESTO || 'Diploma, medalla y premio sorpresa'}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">🥉 Tercer Puesto:</label>
            <input type="text" id="cfg-premio-3" value="${cfg.PREMIOS_TERCER_PUESTO || 'Diploma y medalla'}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button id="btn-guardar-reglas-cloud" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer text-xs">
          <span>💾</span>
          <span>Guardar Configuración en Google Sheets</span>
        </button>
      </div>

    </div>
  `;

  // Evento: Guardar Configuración en Google Sheets
  container.querySelector('#btn-guardar-reglas-cloud').addEventListener('click', async () => {
    const paramsUpdate = {
      NOMBRE_EVENTO: container.querySelector('#cfg-nombre-evento').value.trim(),
      HOMENAJEADO: container.querySelector('#cfg-homenajeado').value.trim(),
      ANIO_CERTAMEN: parseInt(container.querySelector('#cfg-anio').value, 10) || 2026,
      PREMIOS_PRIMER_PUESTO: container.querySelector('#cfg-premio-1').value.trim(),
      PREMIOS_SEGUNDO_PUESTO: container.querySelector('#cfg-premio-2').value.trim(),
      PREMIOS_TERCER_PUESTO: container.querySelector('#cfg-premio-3').value.trim()
    };

    [1, 2, 3, 4, 5].forEach(r => {
      const suffix = r === 5 ? 'FINAL' : String(r);
      paramsUpdate[`DURACION_RONDA_${suffix}`] = parseInt(container.querySelector(`#cfg-dur-${r}`).value, 10);
      paramsUpdate[`NUM_AUDICIONES_RONDA_${suffix}`] = parseInt(container.querySelector(`#cfg-aud-${r}`).value, 10);
      paramsUpdate[`MINIMO_PASAR_RONDA_${suffix}`] = parseInt(container.querySelector(`#cfg-min-${r}`).value, 10);

      // Sincronizar en memoria de CONFIG frontend
      if (CONFIG.ROUNDS[r]) {
        CONFIG.ROUNDS[r].duracion = paramsUpdate[`DURACION_RONDA_${suffix}`];
        CONFIG.ROUNDS[r].audiciones = paramsUpdate[`NUM_AUDICIONES_RONDA_${suffix}`];
        CONFIG.ROUNDS[r].minimoPasar = paramsUpdate[`MINIMO_PASAR_RONDA_${suffix}`];
      }
    });

    DOM.showLoading('Actualizando parámetros en Google Sheets...');
    try {
      await api.guardarConfigLote(paramsUpdate);
      configTemp = { ...configTemp, ...paramsUpdate };
      renderAudiciones(appState.get());
      renderAlumnos(appState.get());
      DOM.showToast('✅ Parámetros de rondas actualizados exitosamente en Google Sheets', 'success');
    } catch (err) {
      DOM.showToast('Error al actualizar configuración: ' + err.message, 'error');
    } finally {
      DOM.hideLoading();
    }
  });
}
