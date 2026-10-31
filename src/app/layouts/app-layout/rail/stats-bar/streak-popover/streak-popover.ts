import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { GamificationApi } from '../../../../../core/gamification/gamification-api';
import { WEEKDAY_LETTERS, currentWeek } from '../../../../../core/gamification/streak-calendar';
import { Button } from '../../../../../shared/ui/button/button';
import { Icon } from '../../../../../shared/ui/icon/icon';
import { NavArt } from '../../../../../shared/ui/nav-art/nav-art';

/** This week's streak at a glance, the Streak Club goal and a link to the full streak page. */
@Component({
  selector: 'app-streak-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, NavArt],
  templateUrl: './streak-popover.html',
  styleUrl: './streak-popover.scss',
})
export class StreakPopover {
  protected readonly streak = toSignal(inject(GamificationApi).getStreak());
  protected readonly letters = WEEKDAY_LETTERS;
  protected readonly week = computed(() => currentWeek(this.streak()?.activeDays ?? []));
  protected readonly clubPercent = computed(() => {
    const streak = this.streak();
    return streak ? Math.min(100, Math.round((streak.streak / streak.clubTarget) * 100)) : 0;
  });
}
