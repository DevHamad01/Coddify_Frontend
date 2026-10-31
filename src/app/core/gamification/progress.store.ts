import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { EditorThemeService } from '../../shared/ui/code-editor/editor-theme.service';
import { LessonReward } from '../learning/learning.models';
import { GamificationApi } from './gamification-api';
import { MissionsSummary, UserStats } from './gamification.models';

function artOf(itemId: string | undefined, fallback: string): string {
  return itemId ? itemId.slice(itemId.indexOf('-') + 1) : fallback;
}

/**
 * App-wide snapshot of the learner's stats and daily missions. Loaded once by the app shell,
 * refreshed after anything that earns XP so every widget (rail, lesson header) stays in sync.
 */
@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private readonly api = inject(GamificationApi);

  readonly stats = signal<UserStats | null>(null);
  readonly missions = signal<MissionsSummary | null>(null);

  readonly leaderboardUnlocked = computed(() => {
    const stats = this.stats();
    return !!stats && stats.totalXp >= stats.leaderboardUnlockXp;
  });
  readonly xpToNextLevel = computed(() => {
    const stats = this.stats();
    return stats ? stats.levelXpTarget - stats.levelXp : 0;
  });

  /** Art keys of the equipped cosmetics (ids are "<slot>-<art>", e.g. "flame-blue"). */
  readonly flameColor = computed(() => artOf(this.stats()?.equipped['streak-flame'], 'classic'));
  readonly frameStyle = computed(() => artOf(this.stats()?.equipped.frame, 'none'));
  readonly nameEffect = computed(() => artOf(this.stats()?.equipped['name-effect'], 'plain'));
  readonly tutorLook = computed(() => artOf(this.stats()?.equipped.tutor, 'bit'));

  constructor() {
    // The equipped editor theme follows the learner into every code editor.
    const editorTheme = inject(EditorThemeService);
    effect(() => {
      const theme = this.stats()?.equipped.theme;
      if (theme) {
        editorTheme.use(theme);
      }
    });
  }

  /** Loads stats and missions; safe to call again to refresh. */
  refresh(): void {
    this.api.getStats().subscribe((stats) => this.stats.set(stats));
    this.api.getMissions().subscribe((missions) => this.missions.set(missions));
  }

  ensureLoaded(): void {
    if (!this.stats()) {
      this.refresh();
    }
  }

  setDailyGoal(activities: number | null): Observable<UserStats> {
    return this.api.setDailyGoal(activities).pipe(tap((stats) => this.stats.set(stats)));
  }

  /** Applies a lesson reward right away (optimistic), then reloads the server's numbers. */
  applyReward(reward: LessonReward): void {
    this.stats.update((stats) =>
      stats
        ? {
            ...stats,
            streak: reward.streak,
            gems: stats.gems + reward.gemsEarned,
            totalXp: stats.totalXp + reward.xpEarned,
            activitiesToday: stats.activitiesToday + (reward.xpEarned ? 1 : 0),
          }
        : stats,
    );
    this.refresh();
  }

  addGems(gems: number): void {
    this.stats.update((stats) => (stats ? { ...stats, gems: stats.gems + gems } : stats));
  }
}
