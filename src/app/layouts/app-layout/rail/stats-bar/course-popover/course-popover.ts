import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseSwitcher } from '../../../../../core/learning/course-switcher.service';
import { LearningApi } from '../../../../../core/learning/learning-api';
import { EnrolledCourse } from '../../../../../core/learning/learning.models';
import { Button } from '../../../../../shared/ui/button/button';
import { TechLogo } from '../../../../../shared/ui/tech-logo/tech-logo';

/** "My journeys": every started course with its progress; picking one makes it active. */
@Component({
  selector: 'app-course-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, TechLogo],
  templateUrl: './course-popover.html',
  styleUrl: './course-popover.scss',
})
export class CoursePopover {
  protected readonly switcher = inject(CourseSwitcher);
  protected readonly courses = signal<readonly EnrolledCourse[] | null>(null);

  constructor() {
    inject(LearningApi)
      .getMyCourses()
      .subscribe((courses) => this.courses.set(courses));
  }
}
