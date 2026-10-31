import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InterviewSet } from '../../../../core/practice/practice.models';
import { Button } from '../../../../shared/ui/button/button';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';

/** Today's three-problem set; the last one is a surprise topic. */
@Component({
  selector: 'app-today-set',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, DifficultyBadge],
  templateUrl: './today-set.html',
  styleUrl: './today-set.scss',
})
export class TodaySet {
  readonly set = input.required<InterviewSet>();
}
