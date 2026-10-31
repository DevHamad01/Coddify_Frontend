import { NavArtName } from '../../shared/ui/nav-art/nav-art';

export interface AppNavItem {
  readonly label: string;
  readonly path: string;
  readonly art: NavArtName;
  /** Shown in the phone bottom bar (max five). */
  readonly mobile?: boolean;
}

export interface AppNavSection {
  readonly label: string;
  readonly items: readonly AppNavItem[];
}

export const APP_NAV: readonly AppNavSection[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Journey', path: '/app/journey', art: 'journey', mobile: true },
      { label: 'Practice', path: '/app/practice', art: 'practice', mobile: true },
      { label: 'Projects', path: '/app/projects', art: 'projects' },
      { label: 'History', path: '/app/history', art: 'history' },
    ],
  },
  {
    label: 'Career',
    items: [{ label: 'Interview', path: '/app/interview', art: 'interview' }],
  },
  {
    label: 'Progress',
    items: [
      { label: 'Missions', path: '/app/missions', art: 'missions', mobile: true },
      { label: 'Leaderboard', path: '/app/leaderboard', art: 'leaderboard', mobile: true },
      { label: 'Store', path: '/app/store', art: 'store' },
    ],
  },
];

export const PROFILE_NAV: AppNavItem = {
  label: 'Profile',
  path: '/app/profile',
  art: 'profile',
  mobile: true,
};
