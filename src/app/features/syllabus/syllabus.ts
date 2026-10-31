import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { ProgressStore } from '../../core/gamification/progress.store';
import { CourseSwitcher } from '../../core/learning/course-switcher.service';
import { LearningApi } from '../../core/learning/learning-api';
import { CourseSection, MiniCourse } from '../../core/learning/learning.models';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { TechId } from '../../shared/data/tech';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { SearchDialogService } from '../../shared/ui/search-dialog/search-dialog.service';
import { TechLogo } from '../../shared/ui/tech-logo/tech-logo';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { MiniCourseCard } from './components/mini-course-card/mini-course-card';
import { SectionCard } from './components/section-card/section-card';

type SortKey = 'title' | 'lessons' | 'newest';

const PAGE_SIZE = 8;

/** A course's sections plus its side courses. `?course=` shows a course other than the active one. */
@Component({
  selector: 'app-syllabus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    Icon,
    TechLogo,
    PageShell,
    LevelCard,
    LeaderboardWidget,
    MissionsWidget,
    SectionCard,
    MiniCourseCard,
  ],
  templateUrl: './syllabus.html',
  styleUrl: './syllabus.scss',
})
export class Syllabus {
  private readonly api = inject(LearningApi);
  private readonly store = inject(ProgressStore);
  private readonly toast = inject(ToastService);
  protected readonly switcher = inject(CourseSwitcher);
  protected readonly search = inject(SearchDialogService);

  /** The `?course=` course, else the active one (known once stats load). */
  protected readonly syllabus = toSignal(
    combineLatest([
      inject(ActivatedRoute).queryParamMap,
      toObservable(this.store.stats).pipe(
        filter((stats) => stats !== null),
        map((stats) => stats.courseId),
        distinctUntilChanged(),
      ),
    ]).pipe(
      map(([params, active]) => (params.get('course') as TechId | null) ?? active),
      distinctUntilChanged(),
      switchMap((courseId) => this.api.getSyllabus(courseId)),
    ),
  );

  protected readonly sorts: readonly { id: SortKey; label: string }[] = [
    { id: 'title', label: 'Title' },
    { id: 'lessons', label: 'Most lessons' },
    { id: 'newest', label: 'Newest' },
  ];
  protected readonly sort = signal<SortKey>('newest');
  protected readonly tag = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly shown = signal(PAGE_SIZE);

  protected readonly tags = computed(() => [
    ...new Set((this.syllabus()?.moreCourses ?? []).flatMap((course) => course.tags)),
  ]);

  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const tag = this.tag();
    const courses = (this.syllabus()?.moreCourses ?? []).filter(
      (course) =>
        (!tag || course.tags.includes(tag)) &&
        (!query || course.title.toLowerCase().includes(query)),
    );
    switch (this.sort()) {
      case 'title':
        return [...courses].sort((a, b) => a.title.localeCompare(b.title));
      case 'lessons':
        return [...courses].sort((a, b) => b.lessonCount - a.lessonCount);
      default:
        return courses;
    }
  });
  protected readonly visible = computed(() => this.filtered().slice(0, this.shown()));

  constructor() {
    this.store.ensureLoaded();
  }

  protected openSection(section: CourseSection, courseId: TechId): void {
    if (section.state === 'locked') {
      this.toast.info(`Finish Section ${section.number - 1} first to unlock ${section.title}.`);
      return;
    }
    this.switcher.open(courseId);
  }

  protected openMiniCourse(course: MiniCourse): void {
    this.toast.info(`${course.title} opens soon. The team is still writing it!`);
  }

  protected toggleTag(tag: string): void {
    this.tag.update((current) => (current === tag ? null : tag));
    this.shown.set(PAGE_SIZE);
  }

  protected showMore(): void {
    this.shown.update((count) => count + PAGE_SIZE);
  }
}
