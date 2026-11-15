/**
 * Cliente para comunicarse con Google Apps Script.
 * Centraliza todas las llamadas HTTP y el manejo de errores.
 */
import { CONFIG } from '../config.js';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Request GET genérico
   */
  async get(action, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const json = await response.json();
      if (!json.success && json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (error) {
      console.error(`[API] Error en GET ${action}:`, error);
      throw error;
    }
  }

  /**
   * Request POST genérico
   */
  async post(action, data = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, data })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const json = await response.json();
      if (!json.success && json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (error) {
      console.error(`[API] Error en POST ${action}:`, error);
      throw error;
    }
  }

  // === MÉTODOS GET ===

  getConfig() {
    return this.get('getConfig');
  }

  getCanciones(anio) {
    return this.get('getCanciones', { anio });
  }

  getAlumnos(anio) {
    return this.get('getAlumnos', { anio });
  }

  getAudicionesRonda(ronda) {
    return this.get('getAudicionesRonda', { ronda });
  }

  getConfigRonda(ronda) {
    return this.get('getConfigRonda', { ronda });
  }

  getAudioUrl(fileId, base64 = false) {
    return this.get('getAudioUrl', { fileId, base64: base64 ? 'true' : 'false' });
  }

  getResultados(ronda = null) {
    return this.get('getResultados', ronda ? { ronda } : {});
  }

  getRanking() {
    return this.get('getRanking');
  }

  getClasificados(ronda = 1) {
    return this.get('getClasificados', { ronda });
  }

  getLogReproducciones(ronda = null) {
    return this.get('getLogReproducciones', ronda ? { ronda } : {});
  }

  getEstadoCertamen() {
    return this.get('getEstadoCertamen');
  }

  // === MÉTODOS POST ===

  guardarAciertos(alumnoId, ronda, audicionNum, acerto) {
    return this.post('guardarAciertos', { alumnoId, ronda, audicionNum, acerto });
  }

  guardarAciertosLote(data) {
    return this.post('guardarAciertosLote', data);
  }

  registrarReproduccion(data) {
    return this.post('registrarReproduccion', data);
  }

  actualizarModoProyector(modo) {
    return this.post('actualizarModoProyector', { modo });
  }

  finalizarRonda(ronda) {
    return this.post('finalizarRonda', { ronda });
  }

  resetRonda(ronda) {
    return this.post('resetRonda', { ronda });
  }

  resetCertamen() {
    return this.post('resetCertamen', {});
  }

  actualizarRondaActual(ronda) {
    return this.post('actualizarRondaActual', { ronda });
  }

  actualizarConfig(clave, valor) {
    return this.post('actualizarConfig', { clave, valor });
  }

  guardarConfigLote(configMap) {
    return this.post('guardarConfigLote', configMap);
  }

  guardarCanciones(canciones) {
    return this.post('guardarCanciones', { canciones });
  }

  eliminarCancion(cancionId) {
    return this.post('eliminarCancion', { cancionId });
  }

  guardarAlumnosLote(alumnos, reemplazar = false) {
    return this.post('guardarAlumnosLote', { alumnos, reemplazar });
  }

  eliminarAlumno(alumnoId) {
    return this.post('eliminarAlumno', { alumnoId });
  }

  limpiarAlumnos() {
    return this.post('limpiarAlumnos', {});
  }

  guardarAudicionesRonda(audiciones) {
    return this.post('guardarAudicionesRonda', { audiciones });
  }

  aleatorizarAudiciones() {
    return this.post('aleatorizarAudiciones', {});
  }
}

// Instancia única
export const api = new ApiClient(CONFIG.API_URL);
