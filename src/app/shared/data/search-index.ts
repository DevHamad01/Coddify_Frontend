import { IconName } from '../ui/icon/icons';
import { TECHS, TechId } from './tech';

export interface SearchItem {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly group: 'Courses' | 'Pages';
  readonly path: string;
  readonly queryParams?: Record<string, string>;
  readonly tech?: TechId;
  readonly icon?: IconName;
}

const PAGES: readonly Omit<SearchItem, 'group'>[] = [
  {
    id: 'journey',
    label: 'Journey',
    hint: 'Continue your course',
    path: '/app/journey',
    icon: 'route',
  },
  {
    id: 'practice',
    label: 'Practice',
    hint: 'Challenges and drills',
    path: '/app/practice',
    icon: 'code',
  },
  {
    id: 'interview',
    label: 'Interview prep',
    hint: 'Problems picked for you',
    path: '/app/interview',
    icon: 'briefcase',
  },
  {
    id: 'missions',
    label: 'Daily missions',
    hint: 'Goals that refresh every day',
    path: '/app/missions',
    icon: 'flag',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    hint: 'Leagues, friends and squads',
    path: '/app/leaderboard',
    icon: 'trophy',
  },
  {
    id: 'store',
    label: 'Store',
    hint: 'Boosts and profile styles',
    path: '/app/store',
    icon: 'gift',
  },
  {
    id: 'profile',
    label: 'Profile',
    hint: 'Streak, XP and badges',
    path: '/app/profile',
    icon: 'user',
  },
  {
    id: 'playground',
    label: 'Playground',
    hint: 'Run code in the browser',
    path: '/resources/playground',
    icon: 'terminal',
  },
];

/** Everything the Ctrl+K dialog can find. Mock until the search API exists. */
export const SEARCH_INDEX: readonly SearchItem[] = [
  ...TECHS.map<SearchItem>((tech) => ({
    id: `course-${tech.id}`,
    label: tech.name,
    hint: 'Course',
    group: 'Courses',
    path: '/register',
    queryParams: { lang: tech.id },
    tech: tech.id,
  })),
  ...PAGES.map<SearchItem>((page) => ({ ...page, group: 'Pages' })),
];
