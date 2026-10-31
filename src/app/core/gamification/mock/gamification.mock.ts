import { MockProgressState } from '../../api/mock/mock-progress';
import { Badge } from '../gamification.models';

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

/**
 * Stand-in for the AI tutor's daily quote: once the AI is wired in, the backend generates a fresh
 * one each day. Until then the mock rotates through this list by date.
 */
const QUOTES: readonly string[] = [
  'Coding is the language of builders. Keep writing your story.',
  'Every expert was once a beginner who refused to quit.',
  'Bugs are just lessons wearing a disguise.',
  'Small daily wins compound into big skills.',
  'Read the error message. It is trying to help you.',
  'The best way to learn to code is to write code that breaks, then fix it.',
  'You do not need to be fast. You need to keep going.',
  'Today’s confusing concept is next month’s obvious one.',
  'A program that works beats a perfect one you never finish.',
  'Learning to code is learning to think differently.',
];

export function quoteOfTheDay(date = new Date()): { text: string; author: string; likes: number } {
  const day = Math.floor(date.getTime() / 86_400_000);
  return {
    text: QUOTES[day % QUOTES.length],
    author: "Bit, Coddify's AI tutor",
    likes: 600 + ((day * 37) % 400),
  };
}

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
