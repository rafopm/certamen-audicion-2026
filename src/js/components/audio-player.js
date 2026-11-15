/**
 * Componente AudioPlayer: reproduce audio con control de tiempo y soporte para inicio aleatorio.
 * Integrado con Timer para detenerse automáticamente tras cumplir la duración exacta.
 */
import { Timer } from './timer.js';

export class AudioPlayer {
  constructor(audioElement, timerDisplay, options = {}) {
    this.audio = audioElement;
    this.timerDisplay = timerDisplay;
    this.onComplete = options.onComplete || (() => {});
    this.onError = options.onError || (() => {});
    
    this.timer = new Timer(timerDisplay, {
      onComplete: () => this.stop()
    });

    this.playbackInfo = {
      startSec: 0,
      endSec: 0,
      duration: 0
    };

    this._setupAudioEvents();
  }

  _setupAudioEvents() {
    this.audio.addEventListener('error', () => {
      const err = this.audio.error;
      const msg = err ? `Error ${err.code}: ${err.message || 'Error de audio'}` : 'Error al cargar el audio';
      this.onError(msg);
    });
  }

  /**
   * Reproduce un audio por un tiempo específico, con opción de iniciar en un segundo aleatorio.
   * @param {string} audioUrl - URL del audio o data URI Base64
   * @param {number} duration - Duración en segundos que debe sonar
   * @param {Object} options - { randomStart: boolean, customStart: number }
   * @returns {Promise<{startSec: number, endSec: number, duration: number}>}
   */
  async play(audioUrl, duration, options = {}) {
    return new Promise((resolve, reject) => {
      this.audio.pause();
      this.audio.currentTime = 0;

      let settled = false;

      const cleanup = () => {
        this.audio.removeEventListener('canplay', onCanPlay);
        this.audio.removeEventListener('error', onAudioError);
        this.audio.removeEventListener('loadedmetadata', onMetadata);
      };

      // Calcula el segundo de inicio garantizando que quede suficiente audio para completar la duración
      const calculateStartTime = () => {
        const totalDuration = this.audio.duration;
        if (options.customStart !== undefined && options.customStart !== null) {
          return Math.max(0, Number(options.customStart) || 0);
        }

        if (options.randomStart && isFinite(totalDuration) && totalDuration > duration) {
          // El inicio máximo permitido para no cortarse antes de tiempo
          const maxStart = Math.max(0, Math.floor(totalDuration - duration));
          // Elegir aleatoriamente entre 0 y maxStart
          return Math.floor(Math.random() * (maxStart + 1));
        }

        return 0;
      };

      const startPlayback = () => {
        if (settled) return;
        settled = true;
        cleanup();

        const startSec = calculateStartTime();
        const endSec = startSec + duration;

        this.playbackInfo = {
          startSec: startSec,
          endSec: endSec,
          duration: duration
        };

        try {
          if (startSec > 0) {
            this.audio.currentTime = startSec;
          }
        } catch (seekErr) {
          console.warn('[PLAYER] Aviso al posicionar segundo de inicio:', seekErr);
        }

        this.audio.play()
          .then(() => {
            this.timer.start(duration);
            resolve(this.playbackInfo);
          })
          .catch(err => {
            this.onError('Error al iniciar reproducción: ' + err.message);
            reject(err);
          });
      };

      const onCanPlay = () => {
        startPlayback();
      };

      const onMetadata = () => {
        // En muchos navegadores metadata es suficiente para calcular duración y posición
        if (this.audio.readyState >= 2) {
          startPlayback();
        }
      };

      const onAudioError = () => {
        if (settled) return;
        settled = true;
        cleanup();
        const err = this.audio.error;
        const msg = err ? `Error (${err.code}) al cargar audio` : 'Error de reproducción';
        this.onError(msg);
        reject(new Error(msg));
      };

      this.audio.addEventListener('loadedmetadata', onMetadata);
      this.audio.addEventListener('canplay', onCanPlay);
      this.audio.addEventListener('error', onAudioError);

      this.audio.src = audioUrl;
      this.audio.load();

      // Intento directo rápido si el audio ya está listo en buffer
      if (this.audio.readyState >= 3) {
        startPlayback();
      }
    });
  }

  stop() {
    try {
      this.audio.pause();
    } catch (e) {}
    this.timer.stop();
    this.onComplete();
  }

  pause() {
    this.audio.pause();
  }

  resume() {
    this.audio.play();
  }
}
