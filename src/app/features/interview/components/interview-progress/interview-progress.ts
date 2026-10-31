import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DIFFICULTIES, InterviewProgress } from '../../../../core/practice/practice.models';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';

const RADIUS = 52;

/** Donut of solved problems with a per-difficulty breakdown. */
@Component({
  selector: 'app-interview-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DifficultyBadge],
  templateUrl: './interview-progress.html',
  styleUrl: './interview-progress.scss',
})
export class InterviewProgressCard {
  readonly progress = input.required<InterviewProgress>();
  /** Problems in the bank, used to size the ring. */
  readonly total = input<number>(62);

  protected readonly difficulties = DIFFICULTIES;
  protected readonly radius = RADIUS;
  protected readonly circumference = 2 * Math.PI * RADIUS;
  protected readonly solved = computed(() =>
    Object.values(this.progress().solved).reduce((sum, n) => sum + n, 0),
  );
  protected readonly dashOffset = computed(
    () => this.circumference * (1 - Math.min(1, this.solved() / this.total())),
  );
}
