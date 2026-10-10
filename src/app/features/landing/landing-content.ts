import { AccordionItem } from '../../shared/ui/accordion/accordion';
import { IconName } from '../../shared/ui/icon/icons';

/** Static demo numbers for the hero counters (replace with live stats once the API exposes them). */
export const HERO_STATS = { learners: 12480, codeRunsToday: 38950 } as const;

export type TokenKind = 'kw' | 'fn' | 'str' | 'num' | 'cm' | 'pl' | 'op';
export interface CodeToken {
  readonly text: string;
  readonly kind: TokenKind;
}
export type CodeLine = readonly CodeToken[];

const t = (text: string, kind: TokenKind = 'pl'): CodeToken => ({ text, kind });

/** Hero editor: a tiny Python exercise with one failing test case. */
export const HERO_CODE: readonly CodeLine[] = [
  [t('def ', 'kw'), t('greet', 'fn'), t('(name):')],
  [t('    '), t('# Return a friendly greeting', 'cm')],
  [t('    '), t('return ', 'kw'), t('"Salam, "', 'str'), t(' + ', 'op'), t('name')],
  [],
  [t('print', 'fn'), t('(greet('), t('"Ayesha"', 'str'), t('))')],
];

export interface TestCase {
  readonly label: string;
  readonly passed: boolean;
}

export const HERO_TESTS: readonly TestCase[] = [
  { label: 'Test 1', passed: true },
  { label: 'Test 2', passed: true },
  { label: 'Test 3', passed: false },
];

export interface Roadmap {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly steps: readonly { readonly label: string; readonly icon: IconName }[];
}

export const ROADMAPS: readonly Roadmap[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    summary: 'The fundamentals interviewers actually test, in the order that makes them stick.',
    steps: [
      { label: 'First language, done right', icon: 'code' },
      { label: 'Terminal basics', icon: 'terminal' },
      { label: 'Git and teamwork', icon: 'route' },
      { label: 'Data structures', icon: 'layers' },
      { label: 'Algorithms', icon: 'bolt' },
      { label: 'Clean, readable code', icon: 'book' },
    ],
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    summary: 'From your first web page to a deployed app you can show in interviews.',
    steps: [
      { label: 'HTML and CSS basics', icon: 'monitor' },
      { label: 'JavaScript essentials', icon: 'code' },
      { label: 'The DOM and events', icon: 'layers' },
      { label: 'Talking to APIs', icon: 'globe' },
      { label: 'A modern framework', icon: 'sparkles' },
      { label: 'Ship a portfolio site', icon: 'send' },
    ],
  },
  {
    id: 'freelancing',
    title: 'Freelancing Starter',
    summary: 'Skills clients pay for, plus the habits that get you repeat work.',
    steps: [
      { label: 'Python for automation', icon: 'code' },
      { label: 'Scraping and spreadsheets', icon: 'layers' },
      { label: 'Small web projects', icon: 'monitor' },
      { label: 'Git for client work', icon: 'route' },
      { label: 'Pricing your first gig', icon: 'briefcase' },
      { label: 'Build a profile that wins', icon: 'star' },
    ],
  },
];

export interface LeagueRow {
  readonly rank: number;
  readonly name: string;
  readonly xp: number;
  readonly streak: number;
  readonly color: string;
  readonly isYou?: boolean;
}

export const LEAGUE_ROWS: readonly LeagueRow[] = [
  { rank: 1, name: 'Zainab', xp: 2860, streak: 31, color: '#8B5CF6' },
  { rank: 2, name: 'Hamza', xp: 2645, streak: 18, color: '#38BDF8' },
  { rank: 3, name: 'You', xp: 2410, streak: 12, color: '#14B8A6', isYou: true },
  { rank: 4, name: 'Ayesha', xp: 2190, streak: 9, color: '#FB923C' },
  { rank: 5, name: 'Bilal', xp: 1985, streak: 7, color: '#22C55E' },
  { rank: 6, name: 'Fatima', xp: 1720, streak: 4, color: '#FBBF24' },
];

/** Number of rows in the promotion zone of the league mock. */
export const PROMOTION_SPOTS = 5;

export const FAQ_ITEMS: readonly AccordionItem[] = [
  {
    question: 'Is Coddify free?',
    answer:
      'Yes. Every lesson, the daily streak, leagues and the AI tutor hints are free while Coddify is in its launch phase. We will always keep a free path through the core courses.',
  },
  {
    question: 'How long does it take to learn to code?',
    answer:
      'With 10 to 15 minutes a day, most learners finish a beginner course in six to eight weeks. Consistency beats long weekend sessions, which is exactly what the streak is for.',
  },
  {
    question: 'Which language should I learn first?',
    answer:
      'If you are unsure, start with Python. It reads almost like English, so you can focus on thinking like a programmer. Our onboarding quiz can also recommend one based on your goal.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No setup at all. You write and run code right in the browser, so a laptop in the university lab or at home works the same.',
  },
  {
    question: 'Will I get a certificate?',
    answer:
      'Yes. Finish all lessons and the final project of a course and you get a certificate with a unique verification link you can add to your CV or LinkedIn.',
  },
  {
    question: 'Does it work on mobile?',
    answer:
      'Yes. Coddify is fully responsive, so you can keep your streak alive from your phone and switch to a bigger screen for longer exercises.',
  },
];
