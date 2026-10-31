import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GamificationApi } from '../../../../core/gamification/gamification-api';
import { LeaderboardEntry } from '../../../../core/gamification/gamification.models';
import { ProgressStore } from '../../../../core/gamification/progress.store';
import { Icon } from '../../../../shared/ui/icon/icon';

/** Locked shield until the learner reaches the unlock XP, then their league rank. */
@Component({
  selector: 'app-leaderboard-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './leaderboard-widget.html',
  styleUrl: './leaderboard-widget.scss',
})
export class LeaderboardWidget {
  protected readonly store = inject(ProgressStore);
  private readonly api = inject(GamificationApi);

  protected readonly me = signal<LeaderboardEntry | null>(null);
  protected readonly ahead = signal<LeaderboardEntry | null>(null);

  constructor() {
    effect(() => {
      if (!this.store.leaderboardUnlocked()) {
        return;
      }
      this.api.getLeaderboard('league').subscribe((board) => {
        const index = board.entries.findIndex((entry) => entry.isMe);
        this.me.set(board.entries[index] ?? null);
        this.ahead.set(index > 0 ? board.entries[index - 1] : null);
      });
    });
  }
}
