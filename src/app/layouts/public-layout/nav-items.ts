import { IconName } from '../../shared/ui/icon/icons';

export interface NavLink {
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
  readonly path: string;
  readonly fragment?: string;
}

export interface NavMenu {
  readonly id: 'languages' | 'spaces' | 'resources' | 'company';
  readonly label: string;
  readonly links: readonly NavLink[];
}

/** Languages menu is rendered from LANGUAGES; these are the remaining dropdowns. */
export const NAV_MENUS: readonly NavMenu[] = [
  {
    id: 'spaces',
    label: 'Spaces',
    links: [
      {
        label: 'Learning journey',
        description: 'Bite-sized lessons on a path that unlocks as you go.',
        icon: 'route',
        path: '/app',
      },
      {
        label: 'Practice arena',
        description: 'Short challenges with instant test results.',
        icon: 'code',
        path: '/app',
      },
      {
        label: 'Leagues',
        description: 'Weekly XP races with learners at your level.',
        icon: 'trophy',
        path: '/app',
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    links: [
      {
        label: 'Roadmaps',
        description: 'Career paths with courses in the right order.',
        icon: 'route',
        path: '/',
        fragment: 'roadmaps',
      },
      {
        label: 'AI tutor',
        description: 'Hints that nudge you forward, never the answer.',
        icon: 'sparkles',
        path: '/',
        fragment: 'ai-tutor',
      },
      {
        label: 'Certificates',
        description: 'Proof of every course you finish.',
        icon: 'award',
        path: '/',
        fragment: 'certificates',
      },
      {
        label: 'FAQ',
        description: 'Quick answers before you start.',
        icon: 'help-circle',
        path: '/',
        fragment: 'faq',
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    links: [
      { label: 'About us', icon: 'users', path: '/about' },
      { label: 'Contact', icon: 'mail', path: '/contact' },
      { label: 'Privacy policy', icon: 'shield', path: '/privacy' },
      { label: 'Terms of use', icon: 'book', path: '/terms' },
    ],
  },
];
