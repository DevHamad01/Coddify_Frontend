import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { CourseSwitcher } from '../../core/learning/course-switcher.service';
import { LearningApi } from '../../core/learning/learning-api';
import { CATALOG_CATEGORIES } from '../../layouts/public-layout/nav-items';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { techsIn } from '../../shared/data/tech';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { TechLogo } from '../../shared/ui/tech-logo/tech-logo';
import { CourseTile } from './components/course-tile/course-tile';
import { PathCard } from './components/path-card/path-card';
import { CAREER_PATHS, CareerPath } from './journeys-content';

/** Every course and career path; picking one opens it on the journey screen. */
@Component({
  selector: 'app-journeys',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    Icon,
    TechLogo,
    PageShell,
    LevelCard,
    MissionsWidget,
    PathCard,
    CourseTile,
  ],
  templateUrl: './journeys.html',
  styleUrl: './journeys.scss',
})
export class Journeys {
  protected readonly switcher = inject(CourseSwitcher);
  protected readonly myCourses = toSignal(inject(LearningApi).getMyCourses());
  protected readonly query = signal('');

  protected readonly active = computed(() => this.myCourses()?.find((course) => course.active));
  protected readonly enrolled = computed(
    () => new Set((this.myCourses() ?? []).map((course) => course.courseId)),
  );

  protected readonly paths = computed(() => {
    const query = this.query().trim().toLowerCase();
    return CAREER_PATHS.filter((path) => !query || path.title.toLowerCase().includes(query));
  });

  /** Catalog categories (minus "Popular") with the courses matching the search. */
  protected readonly categories = computed(() => {
    const query = this.query().trim().toLowerCase();
    return CATALOG_CATEGORIES.filter((category) => category.id !== 'popular')
      .map((category) => ({
        ...category,
        techs: techsIn(category.id).filter(
          (tech) => !query || tech.name.toLowerCase().includes(query),
        ),
      }))
      .filter((category) => category.techs.length);
  });

  protected openPath(path: CareerPath): void {
    this.switcher.open(path.courses[0]);
  }
}
