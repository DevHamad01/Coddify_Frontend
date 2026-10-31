import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TechId } from '../../shared/data/tech';
import { ProgressStore } from '../gamification/progress.store';
import { LearningApi } from './learning-api';

/** Opens a course on the journey screen, enrolling the learner first if needed. */
@Injectable({ providedIn: 'root' })
export class CourseSwitcher {
  private readonly api = inject(LearningApi);
  private readonly store = inject(ProgressStore);
  private readonly router = inject(Router);

  /** Course being opened right now, for loading states. */
  readonly opening = signal<TechId | null>(null);

  open(courseId: TechId): void {
    if (this.store.stats()?.courseId === courseId) {
      void this.router.navigateByUrl('/app/journey');
      return;
    }
    this.opening.set(courseId);
    this.api
      .startCourse(courseId)
      .pipe(finalize(() => this.opening.set(null)))
      .subscribe(() => {
        this.store.refresh();
        void this.router.navigateByUrl('/app/journey');
      });
  }
}
