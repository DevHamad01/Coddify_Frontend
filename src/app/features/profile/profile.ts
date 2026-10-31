import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { GamificationApi } from '../../core/gamification/gamification-api';
import { Badge } from '../../core/gamification/gamification.models';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Icon } from '../../shared/ui/icon/icon';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ProfileMenu } from './components/profile-menu/profile-menu';

/** The learner's own profile: identity, streak/XP/league, levels, collection and badges. */
@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Avatar, Icon, Mascot, NavArt, PageShell, LevelCard, ProfileMenu],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly toast = inject(ToastService);
  protected readonly profile = toSignal(inject(GamificationApi).getProfile());

  protected share(): void {
    this.toast.success('Profile link copied!');
  }

  protected earned(badges: readonly Badge[]): number {
    return badges.filter((badge) => badge.progress >= badge.target).length;
  }

  protected percent(progress: number, target: number): number {
    return Math.round((progress / target) * 100);
  }
}
