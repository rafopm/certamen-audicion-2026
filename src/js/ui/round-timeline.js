import { appState } from '../core/state.js';
import { CONFIG } from '../config.js';

export function renderRoundTimeline() {
  const container = document.getElementById('round-timeline');
  if (!container) return;

  const state = appState.get();
  const activeRound = Number(state.rondaActual) || 1;
  const selectedRound = Number(state.rondaVista) || activeRound;

  container.innerHTML = Object.entries(CONFIG.ROUNDS).map(([roundValue, roundConfig]) => {
    const round = Number(roundValue);
    const completed = Boolean(CONFIG.COMPLETED_ROUNDS[round]);
    const isActive = round === activeRound;
    const availableNext = round === activeRound + 1 && Boolean(state.rondaCerrada);
    const selectable = isActive || (round < activeRound && completed) || availableNext;
    const selected = round === selectedRound;
    const status = isActive
      ? (completed ? 'Ronda activa · completada' : 'En curso')
      : completed
        ? 'Completada · solo lectura'
        : availableNext
          ? 'Disponible'
          : 'Bloqueada';
    const selectedStyle = selected
      ? 'border-yellow-400 bg-yellow-500/15 text-yellow-100'
      : 'border-slate-700 bg-slate-950/70 text-slate-300';

    return `
      <button
        type="button"
        data-round="${round}"
        aria-pressed="${selected}"
        title="${roundConfig.nombre}: ${status}"
        ${selectable ? '' : 'disabled'}
        class="min-w-28 rounded-lg border px-3 py-2 text-left transition ${selectedStyle} ${selectable ? 'hover:border-yellow-400 cursor-pointer' : 'opacity-45 cursor-not-allowed'}"
      >
        <span class="block text-xs font-bold">${roundConfig.nombre}</span>
        <span class="block mt-0.5 text-[10px] opacity-80">${status}</span>
      </button>
    `;
  }).join('');
}

export function bindRoundTimeline(select) {
  const container = document.getElementById('round-timeline');
  if (!container || !select || container.dataset.bound === 'true') return;

  container.dataset.bound = 'true';
  container.addEventListener('click', event => {
    const button = event.target.closest('button[data-round]');
    if (!button || button.disabled) return;

    const round = button.dataset.round;
    if (select.value === round) return;
    select.value = round;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
