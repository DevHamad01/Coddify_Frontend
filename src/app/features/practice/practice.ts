import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { ChallengeList } from './components/challenge-list/challenge-list';

type PracticeTab = 'interview' | 'challenges';

/** Practice hub with two tabs: interview prep and the free challenge bank. `?tab=` remembers it. */
@Component({
  selector: 'app-practice',
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
    ChallengeList,
  ],
  templateUrl: './practice.html',
  styleUrl: './practice.scss',
})
export class Practice {
  private readonly router = inject(Router);

  protected readonly tabs: readonly { id: PracticeTab; label: string }[] = [
    { id: 'interview', label: 'Interview prep' },
    { id: 'challenges', label: 'Challenges' },
  ];
  protected readonly tab = signal<PracticeTab>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('tab') === 'challenges'
      ? 'challenges'
      : 'interview',
  );

  protected readonly steps = [
    { icon: 'calendar', text: 'Set your interview date and get a plan that fits it.' },
    { icon: 'target', text: 'Three problems a day, picked for the topics you need.' },
    { icon: 'lightbulb', text: 'Hints, a full walkthrough and similar problems on each one.' },
  ] as const;

  protected select(tab: PracticeTab): void {
    this.tab.set(tab);
    void this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
  }
}
