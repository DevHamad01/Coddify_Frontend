import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../../shared/ui/chip/chip';
import { Icon } from '../../../../shared/ui/icon/icon';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';
import { FeatureSplit } from '../../components/feature-split/feature-split';

type DayState = 'done' | 'frozen' | 'today' | 'future';

const TODAY = 13;
const FROZEN_DAY = 5;
const DAYS_IN_MONTH = 31;
/** October 2026 starts on a Thursday (Mon-first grid → 3 leading blanks). */
const LEADING_BLANKS = 3;

@Component({
  selector: 'app-streak',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, ProgressBar, FeatureSplit],
  host: { id: 'streak', class: 'block scroll-mt-16' },
  templateUrl: './streak.html',
  styleUrl: './streak.scss',
})
export class Streak {
  protected readonly weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  protected readonly blanks = Array.from({ length: LEADING_BLANKS }, (_, i) => i);
  protected readonly days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
    const n = i + 1;
    const state: DayState =
      n === FROZEN_DAY ? 'frozen' : n < TODAY ? 'done' : n === TODAY ? 'today' : 'future';
    return { n, state };
  });
  protected readonly dayClass: Record<DayState, string> = {
    done: 'bg-streak text-white',
    frozen: 'bg-info text-white',
    today: 'border-2 border-streak text-streak',
    future: 'text-muted/50',
  };
}
