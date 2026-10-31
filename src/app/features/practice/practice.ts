import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressStore } from '../../core/gamification/progress.store';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Button } from '../../shared/ui/button/button';
import { NavArt } from '../../shared/ui/nav-art/nav-art';

/** XP needed before the daily challenge unlocks. */
const DAILY_CHALLENGE_XP = 1000;

/** Practice hub: personalised drills, the daily challenge, interview prep and the challenge bank. */
@Component({
  selector: 'app-practice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    NavArt,
    PageShell,
    LevelCard,
    PromoCard,
    LeaderboardWidget,
    MissionsWidget,
  ],
  templateUrl: './practice.html',
  styleUrl: './practice.scss',
})
export class Practice {
  private readonly store = inject(ProgressStore);

  protected readonly dailyChallengeXp = DAILY_CHALLENGE_XP;
  protected readonly dailyUnlocked = computed(
    () => (this.store.stats()?.totalXp ?? 0) >= DAILY_CHALLENGE_XP,
  );
}
