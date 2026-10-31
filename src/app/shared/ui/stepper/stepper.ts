import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Compact "Step 2 of 4" indicator with dots. `current` is 0-based. */
@Component({
  selector: 'app-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-3' },
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class Stepper {
  readonly total = input.required<number>();
  readonly current = input<number>(0);
  readonly showLabel = input<boolean>(true);

  protected readonly steps = computed(() => Array.from({ length: this.total() }, (_, i) => i));
}
