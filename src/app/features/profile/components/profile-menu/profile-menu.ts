import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';

interface MenuLink {
  readonly label: string;
  readonly icon: IconName;
  readonly path: string;
  readonly fragment?: string;
  readonly external?: boolean;
}

const GROUPS: readonly { label: string; links: readonly MenuLink[] }[] = [
  {
    label: 'Profile',
    links: [
      { label: 'Overview', icon: 'user', path: '/app/profile' },
      { label: 'Edit profile', icon: 'pencil', path: '/app/profile/edit' },
      { label: 'Public profile', icon: 'id-card', path: '/app/profile/public', external: true },
    ],
  },
  {
    label: 'Achievements',
    links: [
      { label: 'Levels', icon: 'bar-chart', path: '/app/profile', fragment: 'levels' },
      { label: 'Badges', icon: 'award', path: '/app/profile', fragment: 'badges' },
      { label: 'Collection', icon: 'sparkles', path: '/app/profile', fragment: 'collection' },
      { label: 'History', icon: 'hourglass', path: '/app/history' },
      { label: 'Certifications', icon: 'graduation', path: '/app/profile/certifications' },
    ],
  },
  {
    label: 'Get social',
    links: [
      { label: 'Notifications', icon: 'bell', path: '/app/profile/notifications' },
      { label: 'Friends', icon: 'users', path: '/app/leaderboard' },
      { label: 'Search friends', icon: 'search', path: '/app/profile/search-friends' },
      { label: 'Refer a friend', icon: 'user-plus', path: '/app/profile/refer' },
    ],
  },
  {
    label: 'Account',
    links: [
      { label: 'Preferences', icon: 'sliders', path: '/app/profile/preferences' },
      { label: 'Social accounts', icon: 'share', path: '/app/profile/social' },
      { label: 'Progress', icon: 'history', path: '/app/profile/progress' },
    ],
  },
];

/** Profile section navigation shown in the right rail. */
@Component({
  selector: 'app-profile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu {
  protected readonly groups = GROUPS;
  protected readonly auth = inject(AuthService);
}
