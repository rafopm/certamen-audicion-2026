/**
 * Componente Timer: cuenta regresiva visual.
 * Reutilizable en cualquier parte de la app.
 */
export class Timer {
  constructor(displayElement, options = {}) {
    this.display = displayElement;
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.intervalId = null;
    this.timeLeft = 0;
  }

  /**
   * Inicia el temporizador
   * @param {number} duration - Duración en segundos
   */
  start(duration) {
    this.stop(); // Limpia cualquier timer previo
    this.timeLeft = duration;
    this._updateDisplay();

    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this._updateDisplay();
      this.onTick(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.timeLeft = 0;
    this._updateDisplay();
  }

  _updateDisplay() {
    if (this.display) {
      this.display.textContent = this.timeLeft;
    }
  }
}