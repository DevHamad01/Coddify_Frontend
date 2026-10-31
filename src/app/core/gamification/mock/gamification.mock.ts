import { MockProgressState } from '../../api/mock/mock-progress';
import { Badge, StoreItem } from '../gamification.models';

/** Levels are named after data sizes: every level needs 150 XP more than the one before. */
const LEVEL_NAMES = ['Kilo', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa', 'Zetta', 'Yotta'];
const XP_STEP = 150;

export function levelFor(totalXp: number): {
  level: number;
  name: string;
  xpIntoLevel: number;
  xpForLevel: number;
} {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= XP_STEP * level) {
    remaining -= XP_STEP * level;
    level++;
  }
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    xpIntoLevel: remaining,
    xpForLevel: XP_STEP * level,
  };
}

export const LEAGUE_RIVALS: readonly {
  userId: string;
  name: string;
  xp: number;
  isPrivate?: boolean;
}[] = [
  { userId: 'r1', name: 'hamza.codes', xp: 181 },
  { userId: 'r2', name: 'Private User', xp: 51, isPrivate: true },
  { userId: 'r3', name: 'ayesha_dev', xp: 35 },
  { userId: 'r4', name: 'Matvey T.', xp: 35 },
  { userId: 'r5', name: 'Ji-woo', xp: 35 },
  { userId: 'r6', name: 'Ahmed Khan', xp: 34 },
  { userId: 'r7', name: 'Arjun C.', xp: 30 },
  { userId: 'r8', name: 'kareem215', xp: 28 },
  { userId: 'r9', name: 'Nazeer A.', xp: 22 },
  { userId: 'r10', name: 'Marib Batool', xp: 20 },
  { userId: 'r11', name: 'Lucas M.', xp: 15 },
  { userId: 'r12', name: 'fatima.py', xp: 10 },
  { userId: 'r13', name: 'Omar S.', xp: 5 },
];

export const FRIENDS: readonly { userId: string; name: string; xp: number }[] = [
  { userId: 'f1', name: 'Isra', xp: 120 },
  { userId: 'f2', name: 'Bilal', xp: 45 },
];

export const WEEKLY_QUOTE = {
  text: 'Coding is the language of builders. Keep writing your story.',
  author: "Bit, Coddify's AI tutor",
  likes: 932,
};

export const STORE_ITEMS: readonly StoreItem[] = [
  // Profile → titles
  {
    id: 'bit-apprentice',
    tab: 'profile',
    kind: 'title',
    name: "Bit's Apprentice",
    description: "Just starting out, but full of promise. Learning fast under Bit's watchful eye.",
    state: 'owned',
    art: 'robot',
  },
  {
    id: 'code-crusader',
    tab: 'profile',
    kind: 'title',
    name: 'Code Crusader',
    description: 'You tackle bugs head-on and code with purpose. A true digital warrior.',
    state: 'owned',
    art: 'code',
  },
  {
    id: 'loop-legend',
    tab: 'profile',
    kind: 'title',
    name: 'Loop Legend',
    description: "You've mastered repetition. Smooth, efficient and endlessly clever.",
    state: 'owned',
    art: 'infinity',
  },
  {
    id: 'motivator',
    tab: 'profile',
    kind: 'title',
    name: 'Motivator',
    description: 'Your energy drives the mission. Streak strong, inspire harder.',
    state: 'locked',
    requirement: '7+ day streak',
    art: 'flame',
  },
  {
    id: 'night-owl',
    tab: 'profile',
    kind: 'title',
    name: 'Night Coder',
    description: 'Your best ideas arrive after midnight.',
    state: 'buyable',
    price: 40,
    art: 'moon',
  },
  // Profile → frames, name effects, flames
  {
    id: 'frame-circuit',
    tab: 'profile',
    kind: 'frame',
    name: 'Circuit Frame',
    description: 'A glowing circuit ring around your avatar.',
    state: 'buyable',
    price: 60,
    art: 'frame',
  },
  {
    id: 'frame-gold',
    tab: 'profile',
    kind: 'frame',
    name: 'Gold Frame',
    description: 'For learners who finished a whole course.',
    state: 'locked',
    requirement: 'Finish a course',
    art: 'frame',
  },
  {
    id: 'name-glow',
    tab: 'profile',
    kind: 'name-effect',
    name: 'Neon Name',
    description: 'Your name glows on the leaderboard.',
    state: 'buyable',
    price: 80,
    art: 'sparkles',
  },
  {
    id: 'flame-blue',
    tab: 'profile',
    kind: 'streak-flame',
    name: 'Blue Flame',
    description: 'A cooler colour for your streak flame.',
    state: 'locked',
    requirement: '30+ day streak',
    art: 'flame',
  },
  // Boosts
  {
    id: 'streak-freeze',
    tab: 'boosts',
    kind: 'boost',
    name: 'Streak Freeze',
    description: 'Protects your streak for one missed day.',
    state: 'buyable',
    price: 20,
    art: 'snowflake',
  },
  {
    id: 'xp-boost',
    tab: 'boosts',
    kind: 'boost',
    name: 'Double XP (15 min)',
    description: 'Every lesson gives twice the XP for 15 minutes.',
    state: 'buyable',
    price: 30,
    art: 'bolt',
  },
  {
    id: 'energy-refill',
    tab: 'boosts',
    kind: 'boost',
    name: 'Energy Refill',
    description: 'Refill your energy to full right away.',
    state: 'buyable',
    price: 15,
    art: 'bolt',
  },
  // Editor themes
  {
    id: 'theme-midnight',
    tab: 'themes',
    kind: 'theme',
    name: 'Midnight',
    description: 'Deep black editor with violet accents.',
    state: 'buyable',
    price: 50,
    art: 'moon',
  },
  {
    id: 'theme-sakura',
    tab: 'themes',
    kind: 'theme',
    name: 'Sakura',
    description: 'Soft pink highlights for calm sessions.',
    state: 'buyable',
    price: 50,
    art: 'sparkles',
  },
  // AI tutor personalities
  {
    id: 'tutor-coach',
    tab: 'tutors',
    kind: 'tutor',
    name: 'Coach Bit',
    description: 'Short, direct hints that push you to try again.',
    state: 'buyable',
    price: 70,
    art: 'robot',
  },
  {
    id: 'tutor-teacher',
    tab: 'tutors',
    kind: 'tutor',
    name: 'Teacher Bit',
    description: 'Patient explanations with small examples.',
    state: 'buyable',
    price: 70,
    art: 'robot',
  },
];

export function badgesFor(state: Readonly<MockProgressState>): Badge[] {
  return [
    {
      id: 'xp-beginner',
      title: 'Experience Beginner',
      description: 'Earn 100 XP',
      progress: Math.min(state.totalXp, 100),
      target: 100,
      tier: 0,
      maxTier: 4,
    },
    {
      id: 'daily-coder',
      title: 'Daily Coder',
      description: 'Keep a 3-day streak',
      progress: Math.min(state.streak, 3),
      target: 3,
      tier: 0,
      maxTier: 5,
    },
    {
      id: 'happy-user',
      title: 'Happy User',
      description: 'Use Coddify for 5 days',
      progress: Math.min(state.streak, 5),
      target: 5,
      tier: 0,
      maxTier: 5,
    },
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete 5 lessons',
      progress: Math.min(state.completedNodes.length, 5),
      target: 5,
      tier: 0,
      maxTier: 3,
    },
    {
      id: 'collector',
      title: 'Collector',
      description: 'Open 3 chapter chests',
      progress: Math.min(state.claimedChests.length, 3),
      target: 3,
      tier: 0,
      maxTier: 3,
    },
  ];
}
