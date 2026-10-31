import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';

import { Button } from '../button/button';
import { Icon } from '../icon/icon';

const OPTIONS = [
  { value: 2, label: 'Casual' },
  { value: 4, label: 'Regular', recommended: true },
  { value: 6, label: 'Committed' },
  { value: 8, label: 'Serious' },
  { value: 10, label: 'Intense' },
  { value: 12, label: 'Unstoppable' },
] as const;

/**
 * How many activities a day to aim for. Asked after the first completed lesson, and opened
 * from the journey header's goal bar, where an existing goal can also be removed.
 */
@Component({
  selector: 'app-daily-goal-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  host: { '(document:keydown.escape)': 'later.emit()' },
  templateUrl: './daily-goal-modal.html',
  styleUrl: './daily-goal-modal.scss',
})
export class DailyGoalModal {
  readonly activitiesToday = input<number>(0);
  /** The goal already set, if any; preselected and makes "Remove daily goal" available. */
  readonly current = input<number | null>(null);
  readonly saving = input<boolean>(false);
  readonly chosen = output<number>();
  readonly removed = output<void>();
  readonly later = output<void>();

  protected readonly options = OPTIONS;
  protected readonly selected = linkedSignal<number>(() => this.current() ?? 4);
}
