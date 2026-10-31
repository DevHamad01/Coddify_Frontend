import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';
import { RichText } from '../../../../shared/ui/rich-text/rich-text';

/** Hints revealed one at a time, each giving away a little more, then a pointer to the solution. */
@Component({
  selector: 'app-problem-hints',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RichText],
  templateUrl: './problem-hints.html',
  styleUrl: './problem-hints.scss',
})
export class ProblemHints {
  readonly hints = input.required<readonly string[]>();
  readonly openSolution = output<void>();
  /** How many hints are revealed. */
  protected readonly opened = signal(0);
}
