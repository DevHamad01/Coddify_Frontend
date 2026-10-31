import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { GamificationApi } from '../../core/gamification/gamification-api';
import { WEEKDAY_LETTERS, monthGrid } from '../../core/gamification/streak-calendar';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { NavArt } from '../../shared/ui/nav-art/nav-art';

/** The full streak view: month calendar of active days, records and the Streak Club goal. */
@Component({
  selector: 'app-streak',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    Icon,
    NavArt,
    PageShell,
    LevelCard,
    LeaderboardWidget,
    MissionsWidget,
  ],
  templateUrl: './streak.html',
  styleUrl: './streak.scss',
})
export class Streak {
  protected readonly streak = toSignal(inject(GamificationApi).getStreak());
  protected readonly letters = WEEKDAY_LETTERS;

  private readonly now = new Date();
  /** First day of the month shown in the calendar. */
  protected readonly month = signal(new Date(this.now.getFullYear(), this.now.getMonth(), 1));

  protected readonly monthLabel = computed(() =>
    this.month().toLocaleDateString('en', { month: 'long', year: 'numeric' }),
  );
  protected readonly days = computed(() =>
    monthGrid(
      this.month().getFullYear(),
      this.month().getMonth(),
      this.streak()?.activeDays ?? [],
      this.now,
    ),
  );
  protected readonly activeThisMonth = computed(
    () => this.days().filter((day) => day?.active).length,
  );
  /** No browsing into the future. */
  protected readonly isCurrentMonth = computed(
    () =>
      this.month().getFullYear() === this.now.getFullYear() &&
      this.month().getMonth() === this.now.getMonth(),
  );
  protected readonly clubPercent = computed(() => {
    const streak = this.streak();
    return streak ? Math.min(100, Math.round((streak.streak / streak.clubTarget) * 100)) : 0;
  });

  protected shiftMonth(delta: number): void {
    this.month.update((month) => new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }
}
