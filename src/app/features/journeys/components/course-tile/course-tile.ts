import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Tech, formatLearners } from '../../../../shared/data/tech';
import { Icon } from '../../../../shared/ui/icon/icon';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';

/** One course in the catalog grid: logo, name and learner count; ticked once started. */
@Component({
  selector: 'app-course-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TechLogo],
  templateUrl: './course-tile.html',
  styleUrl: './course-tile.scss',
})
export class CourseTile {
  readonly tech = input.required<Tech>();
  readonly enrolled = input<boolean>(false);
  readonly busy = input<boolean>(false);
  readonly opened = output<void>();

  protected readonly formatLearners = formatLearners;
}
