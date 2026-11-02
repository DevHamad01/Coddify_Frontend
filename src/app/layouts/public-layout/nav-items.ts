import { TechCategory, TechId } from '../../shared/data/tech';
import { IconName } from '../../shared/ui/icon/icons';

export interface NavLink {
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
  readonly path: string;
  readonly fragment?: string;
}

export interface NavMenu {
  readonly id: 'resources' | 'company';
  readonly label: string;
  readonly links: readonly NavLink[];
}

export interface CatalogCategory {
  readonly id: TechCategory;
  readonly label: string;
  readonly blurb: string;
}

export interface LearningPath {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly tech: TechId;
}

export interface ResourceGroup {
  readonly id: string;
  readonly label: string;
  readonly links: readonly NavLink[];
}

/** Left column of the Catalog mega menu; each category lists the courses tagged with it. */
export const CATALOG_CATEGORIES: readonly CatalogCategory[] = [
  { id: 'popular', label: 'Popular', blurb: 'The courses most Coddify learners take.' },
  { id: 'web', label: 'Web', blurb: 'Build pages, apps and APIs for the browser.' },
  { id: 'languages', label: 'Programming languages', blurb: 'Pick a language and go deep.' },
  {
    id: 'systems',
    label: 'Systems & hardware',
    blurb: 'Memory, speed and the machine underneath.',
  },
  { id: 'mobile', label: 'Mobile apps', blurb: 'Ship apps for Android and iOS.' },
  { id: 'data', label: 'Data & AI', blurb: 'Query, clean and learn from data.' },
  { id: 'tools', label: 'Tools & DevOps', blurb: 'Git, the terminal, containers and deploys.' },
];

export const LEARNING_PATHS: readonly LearningPath[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    summary: 'Python, Linux, Git, SQL and data structures, then code others can read.',
    tech: 'python',
  },
  {
    id: 'web-developer',
    title: 'Full Stack Web Developer',
    summary: 'HTML, CSS and JavaScript to React and Node, with a deployed project.',
    tech: 'react',
  },
];

/** Resources mega menu. Pages that are not built yet route to the coming-soon placeholder. */
export const RESOURCE_GROUPS: readonly ResourceGroup[] = [
  {
    id: 'coding',
    label: 'Coding',
    links: [
      {
        label: 'Docs',
        description: 'Reference documentation for every supported language.',
        icon: 'file-text',
        path: '/resources/docs',
      },
      {
        label: 'Playground',
        description: 'Write and run code in the browser, no setup required.',
        icon: 'code',
        path: '/resources/playground',
      },
      {
        label: 'Cheat sheets',
        description: 'Quick-reference tables for the languages and tools you use.',
        icon: 'table',
        path: '/resources/cheat-sheets',
      },
      {
        label: 'Glossary',
        description: 'Plain definitions of programming terms, each with an example.',
        icon: 'book',
        path: '/resources/glossary',
      },
      {
        label: 'Interview problems',
        description: 'Coding problems you can run in the browser, with hints.',
        icon: 'braces',
        path: '/resources/interview-problems',
      },
      {
        label: 'Git commands',
        description: 'Every Git command you reach for, with flags and examples.',
        icon: 'git-branch',
        path: '/resources/git-commands',
      },
      {
        label: 'Visualizations',
        description: 'Watch algorithms and data structures run step by step.',
        icon: 'bar-chart',
        path: '/resources/visualizations',
      },
      {
        label: 'Tools',
        description: 'Formatters, converters and other small developer utilities.',
        icon: 'wrench',
        path: '/resources/tools',
      },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
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
        description: 'Proof of every course you finish, ready for LinkedIn.',
        icon: 'award',
        path: '/',
        fragment: 'certificates',
      },
      {
        label: 'Leagues',
        description: 'Weekly XP races with learners at your level.',
        icon: 'trophy',
        path: '/',
        fragment: 'league',
      },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    links: [
      {
        label: 'FAQ',
        description: 'Quick answers before you start.',
        icon: 'help-circle',
        path: '/',
        fragment: 'faq',
      },
      {
        label: 'Contact',
        description: 'Questions, feedback or a bug to report.',
        icon: 'mail',
        path: '/contact',
      },
    ],
  },
];

/** Flat menus used by the footer and the mobile drawer. */
export const NAV_MENUS: readonly NavMenu[] = [
  {
    id: 'resources',
    label: 'Resources',
    links: RESOURCE_GROUPS.flatMap((group) => group.links).filter((link) =>
      ['Docs', 'Playground', 'Roadmaps', 'AI tutor', 'Certificates', 'FAQ'].includes(link.label),
    ),
  },
  {
    id: 'company',
    label: 'Company',
    links: [
      { label: 'About us', icon: 'users', path: '/about' },
      { label: 'Blog', icon: 'file-text', path: '/blog' },
      { label: 'Contact', icon: 'mail', path: '/contact' },
      { label: 'Privacy policy', icon: 'shield', path: '/privacy' },
      { label: 'Terms of use', icon: 'book', path: '/terms' },
    ],
  },
];
