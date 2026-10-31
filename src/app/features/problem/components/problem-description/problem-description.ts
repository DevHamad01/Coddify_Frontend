import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { ProblemDetail } from '../../../../core/practice/practice.models';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';
import { RichText } from '../../../../shared/ui/rich-text/rich-text';

/** Statement, function signature, constraints and numbered examples. */
@Component({
  selector: 'app-problem-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DifficultyBadge, RichText],
  templateUrl: './problem-description.html',
  styleUrl: './problem-description.scss',
})
export class ProblemDescription {
  readonly problem = input.required<ProblemDetail>();
  protected readonly example = signal(0);
  protected readonly paramList = computed(() =>
    this.problem()
      .params.map((param) => `${param.name}: ${param.type}`)
      .join(', '),
  );
}
