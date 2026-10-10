/** Languages offered at launch. Shared by the landing page, navbar and onboarding. */
export type LanguageId = 'python' | 'javascript' | 'cpp' | 'java' | 'csharp';

export interface Language {
  readonly id: LanguageId;
  readonly name: string;
  /** Text shown inside the coloured letter badge. */
  readonly badge: string;
  /** Badge background; deliberately our own palette, not the languages' official brand colours. */
  readonly color: string;
  readonly badgeText: string;
  readonly tagline: string;
  readonly learners: string;
}

export const LANGUAGES: readonly Language[] = [
  {
    id: 'python',
    name: 'Python',
    badge: 'Py',
    color: '#38BDF8',
    badgeText: '#0B1220',
    tagline: 'Friendly syntax, huge in data and AI',
    learners: '48K learners',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    badge: 'JS',
    color: '#FBBF24',
    badgeText: '#0B1220',
    tagline: 'The language of the web',
    learners: '36K learners',
  },
  {
    id: 'cpp',
    name: 'C++',
    badge: 'C++',
    color: '#8B5CF6',
    badgeText: '#FFFFFF',
    tagline: 'Speed, memory and university labs',
    learners: '29K learners',
  },
  {
    id: 'java',
    name: 'Java',
    badge: 'Jv',
    color: '#FB923C',
    badgeText: '#0B1220',
    tagline: 'OOP, Android and enterprise apps',
    learners: '22K learners',
  },
  {
    id: 'csharp',
    name: 'C#',
    badge: 'C#',
    color: '#22C55E',
    badgeText: '#0B1220',
    tagline: '.NET, games and desktop apps',
    learners: '15K learners',
  },
];

export function findLanguage(id: LanguageId): Language {
  const language = LANGUAGES.find((item) => item.id === id);
  if (!language) {
    throw new Error(`Unknown language: ${id}`);
  }
  return language;
}
