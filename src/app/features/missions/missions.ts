import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressStore } from '../../core/gamification/progress.store';
import { InfoCard } from '../../layouts/app-layout/rail/info-card/info-card';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { NavArt } from '../../shared/ui/nav-art/nav-art';

/** Today's missions, the marks they earn and the weekly quote. */
@Component({
  selector: 'app-missions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Icon,
    Mascot,
    NavArt,
    PageShell,
    MissionsWidget,
    LevelCard,
    PromoCard,
    InfoCard,
  ],
  templateUrl: './missions.html',
  styleUrl: './missions.scss',
})
export class Missions {
  protected readonly store = inject(ProgressStore);
  protected readonly quoteOpen = signal(false);
  protected readonly liked = signal(false);

  protected readonly hoursLeft = computed(() => {
    const resetsAt = this.store.missions()?.resetsAt;
    return resetsAt ? Math.max(1, Math.ceil((Date.parse(resetsAt) - Date.now()) / 3_600_000)) : 0;
  });

  constructor() {
    // Missions change as lessons are completed; always show fresh numbers here.
    this.store.refresh();
  }

  /** ISO week number shown under the quote ("Week 44, 2026"). */
  protected readonly weekLabel = (() => {
    const now = new Date();
    const firstThursday = new Date(now.getFullYear(), 0, 4);
    const week = Math.ceil(
      ((now.getTime() - firstThursday.getTime()) / 86_400_000 + firstThursday.getDay() + 1) / 7,
    );
    return `Week ${week}, ${now.getFullYear()}`;
  })();
}
