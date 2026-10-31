import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';

const OPTIONS = [
  { value: 2, label: 'Casual' },
  { value: 4, label: 'Regular', recommended: true },
  { value: 6, label: 'Committed' },
] as const;

/** Asked once, after the first completed lesson: how many activities a day to aim for. */
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
  readonly saving = input<boolean>(false);
  readonly chosen = output<number>();
  readonly later = output<void>();

  protected readonly options = OPTIONS;
  protected readonly selected = signal<number>(4);
}
