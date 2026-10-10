import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Compact "Step 2 of 4" indicator with dots. `current` is 0-based. */
@Component({
  selector: 'app-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-3' },
  template: `
    <ol class="flex items-center gap-1.5" [attr.aria-label]="'Step ' + (current() + 1) + ' of ' + total()">
      @for (step of steps(); track step) {
        <li
          class="h-2 rounded-full transition-all duration-panel"
          [class]="step < current() ? 'w-2 bg-primary' : step === current() ? 'w-6 bg-primary' : 'w-2 bg-border'"
          [attr.aria-current]="step === current() ? 'step' : null"
        ></li>
      }
    </ol>
    @if (showLabel()) {
      <span class="text-xs font-semibold text-muted" aria-hidden="true">{{ current() + 1 }}/{{ total() }}</span>
    }
  `,
})
export class Stepper {
  readonly total = input.required<number>();
  readonly current = input<number>(0);
  readonly showLabel = input<boolean>(true);

  protected readonly steps = computed(() => Array.from({ length: this.total() }, (_, i) => i));
}
