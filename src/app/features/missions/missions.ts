import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressStore } from '../../core/gamification/progress.store';
import { InfoCard } from '../../layouts/app-layout/rail/info-card/info-card';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
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

  /** Date under the quote; a new one is generated every day. */
  protected readonly dayLabel = new Date().toLocaleDateString('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
