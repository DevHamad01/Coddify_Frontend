import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { MiniCourse } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';

/** A short side course ("Make Games with Pygame") in the syllabus grid. */
@Component({
  selector: 'app-mini-course-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './mini-course-card.html',
  styleUrl: './mini-course-card.scss',
})
export class MiniCourseCard {
  readonly course = input.required<MiniCourse>();
  readonly opened = output<void>();
}
