import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SimilarProblem } from '../../../../core/practice/practice.models';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';
import { Icon } from '../../../../shared/ui/icon/icon';

/** Problems that use the same ideas, for more practice on the pattern. */
@Component({
  selector: 'app-similar-problems',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DifficultyBadge, Icon],
  templateUrl: './similar-problems.html',
  styleUrl: './similar-problems.scss',
})
export class SimilarProblems {
  readonly problems = input.required<readonly SimilarProblem[]>();
  /** Where "All problems" leads: the interview bank or the challenge list. */
  readonly allLink = input<string>('/app/interview');
}
