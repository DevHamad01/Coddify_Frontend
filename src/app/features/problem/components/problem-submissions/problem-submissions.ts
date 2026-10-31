import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProblemSubmission } from '../../../../core/practice/practice.models';
import { Icon } from '../../../../shared/ui/icon/icon';

/** Past submissions, newest first; any of them can be loaded back into the editor. */
@Component({
  selector: 'app-problem-submissions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Icon],
  templateUrl: './problem-submissions.html',
  styleUrl: './problem-submissions.scss',
})
export class ProblemSubmissions {
  readonly submissions = input.required<readonly ProblemSubmission[] | null>();
  readonly loadCode = output<ProblemSubmission>();
}
