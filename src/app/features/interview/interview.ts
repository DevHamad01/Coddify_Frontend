import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { PracticeApi } from '../../core/practice/practice-api';
import { InterviewProgress } from '../../core/practice/practice.models';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Icon } from '../../shared/ui/icon/icon';
import { InterviewDay } from './components/interview-day/interview-day';
import { InterviewProgressCard } from './components/interview-progress/interview-progress';
import { ProblemTable } from './components/problem-table/problem-table';
import { TodaySet } from './components/today-set/today-set';

/** Interview prep: today's set, the full problem bank, and progress toward an interview date. */
@Component({
  selector: 'app-interview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    PageShell,
    TodaySet,
    ProblemTable,
    InterviewDay,
    InterviewProgressCard,
    LevelCard,
    PromoCard,
    LeaderboardWidget,
  ],
  templateUrl: './interview.html',
  styleUrl: './interview.scss',
})
export class Interview {
  private readonly api = inject(PracticeApi);

  protected readonly todaySet = toSignal(this.api.getTodaySet());
  protected readonly progress = signal<InterviewProgress | null>(null);

  constructor() {
    this.api.getProgress().subscribe((progress) => this.progress.set(progress));
  }

  protected setDate(date: string | null): void {
    this.api.setInterviewDate(date).subscribe((progress) => this.progress.set(progress));
  }
}
