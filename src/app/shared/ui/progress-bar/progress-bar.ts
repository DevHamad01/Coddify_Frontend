import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Rounded progress bar. `value` is clamped to 0–100. */
@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-3 w-full overflow-hidden rounded-full bg-surface-2',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'clamped()',
    '[attr.aria-label]': 'label()',
  },
  template: `
    <div
      class="relative h-full rounded-full bg-primary transition-[width] duration-panel ease-out"
      [style.width.%]="clamped()"
    >
      <!-- Highlight stripe for the game-like look. -->
      <span class="absolute inset-x-2 top-[3px] h-[3px] rounded-full bg-white/30"></span>
    </div>
  `,
})
export class ProgressBar {
  readonly value = input<number>(0);
  readonly label = input<string>('Progress');

  protected readonly clamped = computed(() => Math.round(Math.min(100, Math.max(0, this.value()))));
}
