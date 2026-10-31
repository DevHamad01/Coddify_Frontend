/**
 * Every course/technology the catalog knows about. Logos are the official marks from the
 * MIT-licensed devicon set, copied to `public/icons/tech/<id>.svg`.
 * Learner counts are mock numbers until the catalog API exists.
 */
export type TechId =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'cpp'
  | 'c'
  | 'java'
  | 'csharp'
  | 'sql'
  | 'go'
  | 'rust'
  | 'kotlin'
  | 'swift'
  | 'php'
  | 'dart'
  | 'ruby'
  | 'lua'
  | 'react'
  | 'angular'
  | 'nextjs'
  | 'nodejs'
  | 'flutter'
  | 'git'
  | 'docker'
  | 'kubernetes'
  | 'linux'
  | 'bash';

export type TechCategory =
  'popular' | 'web' | 'languages' | 'systems' | 'mobile' | 'data' | 'tools';

export interface Tech {
  readonly id: TechId;
  readonly name: string;
  readonly categories: readonly TechCategory[];
  readonly learners: number;
  /** Logo is mostly black; flip it so it stays visible on the dark theme. */
  readonly invertOnDark?: boolean;
}

export const TECHS: readonly Tech[] = [
  { id: 'python', name: 'Python', categories: ['popular', 'languages', 'data'], learners: 48200 },
  {
    id: 'javascript',
    name: 'JavaScript',
    categories: ['popular', 'web', 'languages'],
    learners: 36100,
  },
  { id: 'html', name: 'HTML', categories: ['popular', 'web'], learners: 31400 },
  { id: 'cpp', name: 'C++', categories: ['popular', 'languages', 'systems'], learners: 29300 },
  { id: 'java', name: 'Java', categories: ['popular', 'languages', 'mobile'], learners: 22800 },
  { id: 'c', name: 'C', categories: ['popular', 'languages', 'systems'], learners: 18900 },
  { id: 'sql', name: 'SQL', categories: ['popular', 'data'], learners: 17600 },
  { id: 'csharp', name: 'C#', categories: ['popular', 'languages'], learners: 15200 },
  { id: 'css', name: 'CSS', categories: ['web'], learners: 14700 },
  { id: 'typescript', name: 'TypeScript', categories: ['web', 'languages'], learners: 12300 },
  { id: 'react', name: 'React', categories: ['web'], learners: 11800 },
  { id: 'nodejs', name: 'Node.js', categories: ['web'], learners: 9400 },
  { id: 'angular', name: 'Angular', categories: ['web'], learners: 6100 },
  { id: 'nextjs', name: 'Next.js', categories: ['web'], learners: 5900, invertOnDark: true },
  { id: 'php', name: 'PHP', categories: ['web', 'languages'], learners: 7200 },
  { id: 'go', name: 'Go', categories: ['languages', 'systems'], learners: 6800 },
  {
    id: 'rust',
    name: 'Rust',
    categories: ['languages', 'systems'],
    learners: 6300,
    invertOnDark: true,
  },
  { id: 'kotlin', name: 'Kotlin', categories: ['languages', 'mobile'], learners: 5600 },
  { id: 'swift', name: 'Swift', categories: ['languages', 'mobile'], learners: 4100 },
  { id: 'dart', name: 'Dart', categories: ['languages', 'mobile'], learners: 3900 },
  { id: 'flutter', name: 'Flutter', categories: ['mobile'], learners: 4700 },
  { id: 'ruby', name: 'Ruby', categories: ['languages', 'web'], learners: 2600 },
  { id: 'lua', name: 'Lua', categories: ['languages'], learners: 2900 },
  { id: 'linux', name: 'Linux', categories: ['systems', 'tools'], learners: 8100 },
  { id: 'bash', name: 'Bash', categories: ['tools', 'systems'], learners: 5200 },
  { id: 'git', name: 'Git', categories: ['tools'], learners: 10900 },
  { id: 'docker', name: 'Docker', categories: ['tools'], learners: 7700 },
  { id: 'kubernetes', name: 'Kubernetes', categories: ['tools'], learners: 3300 },
];

export function findTech(id: TechId): Tech {
  const tech = TECHS.find((item) => item.id === id);
  if (!tech) {
    throw new Error(`Unknown tech: ${id}`);
  }
  return tech;
}

export function techsIn(category: TechCategory): readonly Tech[] {
  return TECHS.filter((tech) => tech.categories.includes(category));
}

/** "48.2K" style learner counts. */
export function formatLearners(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(count);
}
