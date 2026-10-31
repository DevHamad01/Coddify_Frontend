import { StoreItem, StoreItemKind, UnlockRule } from '../gamification.models';

/**
 * Every cosmetic in the store. Nothing is sold: each item unlocks once the learner reaches its
 * goal (XP, level, streak, lessons or solved problems), which is what keeps people practising.
 * The backend will hold the same catalog; `art` keys are drawn by the store and profile views.
 */
export type CosmeticDefinition = Omit<StoreItem, 'state' | 'progress'>;

function item(
  kind: StoreItemKind,
  id: string,
  name: string,
  description: string,
  unlock: UnlockRule | null,
  rarity: CosmeticDefinition['rarity'] = 'common',
  art = id,
): CosmeticDefinition {
  const tab = kind === 'theme' ? 'themes' : kind === 'tutor' ? 'tutors' : 'profile';
  return { id, tab, kind, name, description, unlock, rarity, art };
}

const xp = (target: number): UnlockRule => ({ metric: 'xp', target });
const level = (target: number): UnlockRule => ({ metric: 'level', target });
const streak = (target: number): UnlockRule => ({ metric: 'streak', target });
const lessons = (target: number): UnlockRule => ({ metric: 'lessons', target });
const solved = (target: number): UnlockRule => ({ metric: 'solved', target });

export const COSMETICS: readonly CosmeticDefinition[] = [
  // Editor themes (the art key is the Monaco theme id suffix).
  item('theme', 'theme-coddify', 'Coddify Dark', 'The classic near-black editor.', null, 'common', 'coddify'),
  item('theme', 'theme-midnight', 'Midnight', 'Deep navy with soft violet keywords.', level(2), 'common', 'midnight'),
  item('theme', 'theme-ocean', 'Ocean', 'Calm blues and sea-green strings.', lessons(5), 'common', 'ocean'),
  item('theme', 'theme-forest', 'Forest', 'Mossy greens for long, focused sessions.', streak(3), 'rare', 'forest'),
  item('theme', 'theme-sunset', 'Sunset', 'Warm oranges and pinks on dark plum.', xp(500), 'rare', 'sunset'),
  item('theme', 'theme-neon', 'Neon Night', 'Electric pink and cyan on pure black.', solved(5), 'rare', 'neon'),
  item('theme', 'theme-vampire', 'Vampire', 'A dark purple classic with bright accents.', level(5), 'legendary', 'vampire'),
  item('theme', 'theme-solar', 'Solar Flare', 'Gold and amber that burn bright.', streak(7), 'legendary', 'solar'),

  // AI tutor characters (the art key is a tutor look id).
  item('tutor', 'tutor-bit', 'Bit', 'The original Coddify robot. Calm, patient, always nudging.', null, 'common', 'bit'),
  item('tutor', 'tutor-nova', 'Nova', 'Cheerful and quick, celebrates every small win.', lessons(3), 'common', 'nova'),
  item('tutor', 'tutor-byte', 'Byte', 'Cool and to the point. Short hints, no fluff.', xp(200), 'common', 'byte'),
  item('tutor', 'tutor-pixel', 'Pixel', 'Explains everything with games and pictures.', streak(3), 'rare', 'pixel'),
  item('tutor', 'tutor-sage', 'Sage', 'Thoughtful, asks the question that unlocks the answer.', solved(3), 'rare', 'sage'),
  item('tutor', 'tutor-ada', 'Professor Ada', 'PhD in algorithms. Loves a good proof.', level(4), 'legendary', 'ada'),
  item('tutor', 'tutor-luna', 'Luna', 'Night-owl tutor with a soft spot for recursion.', xp(800), 'legendary', 'luna'),
  item('tutor', 'tutor-max', 'Max', 'Hype coach in golden headphones. Never lets you quit.', level(8), 'legendary', 'max'),

  // Titles (the art key is an icon name).
  item('title', 'bit-apprentice', "Bit's Apprentice", 'Everyone starts here.', null, 'common', 'robot'),
  item('title', 'bug-hunter', 'Bug Hunter', 'Solved your first problem.', solved(1), 'common', 'search'),
  item('title', 'code-crusader', 'Code Crusader', 'Finished your first lesson.', lessons(1), 'common', 'code'),
  item('title', 'loop-legend', 'Loop Legend', 'Five lessons done and counting.', lessons(5), 'common', 'infinity'),
  item('title', 'night-owl', 'Night Owl', 'Collected your first 300 XP.', xp(300), 'common', 'moon'),
  item('title', 'byte-master', 'Byte Master', 'Reached level 3.', level(3), 'rare', 'braces'),
  item('title', 'motivator', 'Motivator', 'Kept a 7 day streak.', streak(7), 'rare', 'flame'),
  item('title', 'algorithm-architect', 'Algorithm Architect', 'Solved 10 problems.', solved(10), 'rare', 'git-branch'),
  item('title', 'merge-maestro', 'Merge Maestro', 'Completed 30 lessons.', lessons(30), 'rare', 'layers'),
  item('title', 'coddify-innovator', 'Coddify Innovator', 'Earned 1,500 XP.', xp(1500), 'rare', 'sparkles'),
  item('title', 'commit-crafter', 'Commit Crafter', 'Kept a 14 day streak.', streak(14), 'legendary', 'git-branch'),
  item('title', 'null-pointer-pro', 'Null Pointer Pro', 'Solved 25 problems.', solved(25), 'legendary', 'target'),
  item('title', 'code-oracle', 'Code Oracle', 'Reached level 10.', level(10), 'legendary', 'eye'),
  item('title', 'quantum-coder', 'Quantum Coder', 'Earned 3,000 XP.', xp(3000), 'legendary', 'globe'),
  item('title', 'recursion-ranger', 'Recursion Ranger', 'Solved 50 problems.', solved(50), 'legendary', 'refresh'),

  // Profile frames (the art key is a CSS frame style).
  item('frame', 'frame-none', 'No Frame', 'Clean avatar with no extra frame.', null, 'common', 'none'),
  item('frame', 'frame-copper', 'Copper Ring', 'A warm copper border around your avatar.', xp(100), 'common', 'copper'),
  item('frame', 'frame-silver', 'Silver Ring', 'Polished silver frame for your profile.', xp(300), 'common', 'silver'),
  item('frame', 'frame-teal', 'Coddify Teal', 'Official Coddify teal ring.', lessons(3), 'common', 'teal'),
  item('frame', 'frame-emerald', 'Emerald Ring', 'A vivid emerald border.', streak(3), 'rare', 'emerald'),
  item('frame', 'frame-violet', 'Violet Glow', 'A violet ring with a soft glow.', level(3), 'rare', 'violet'),
  item('frame', 'frame-ember', 'Ember Pulse', 'A living ember ring that pulses with heat.', streak(7), 'rare', 'ember'),
  item('frame', 'frame-circuit', 'Neon Circuit', 'Glowing circuit-style border.', solved(5), 'rare', 'circuit'),
  item('frame', 'frame-gold', 'Gold Laurel', 'Champion gold frame for your profile.', level(6), 'legendary', 'gold'),
  item('frame', 'frame-diamond', 'Diamond Halo', 'A shimmering ring with an icy sparkle.', xp(2000), 'legendary', 'diamond'),
  item('frame', 'frame-prism', 'Prism Ring', 'A spinning ring of rainbow light.', level(10), 'legendary', 'prism'),
  item('frame', 'frame-aurora', 'Aurora', 'Northern lights in teal, violet and pink, always moving.', streak(30), 'legendary', 'aurora'),

  // Name effects (the art key is a CSS text effect).
  item('name-effect', 'name-plain', 'Plain', 'Your name, no effect.', null, 'common', 'plain'),
  item('name-effect', 'name-teal-glow', 'Teal Glow', 'A soft Coddify glow.', xp(150), 'common', 'teal-glow'),
  item('name-effect', 'name-ocean', 'Ocean Gradient', 'Blue to sea-green.', streak(3), 'common', 'ocean'),
  item('name-effect', 'name-sunset', 'Sunset Gradient', 'Orange fading into pink.', lessons(5), 'rare', 'sunset'),
  item('name-effect', 'name-neon', 'Neon Sign', 'Buzzing pink neon.', solved(5), 'rare', 'neon'),
  item('name-effect', 'name-gold', 'Gold Shine', 'A gold sheen sweeps across your name.', level(5), 'legendary', 'gold'),
  item('name-effect', 'name-rainbow', 'Rainbow Shimmer', 'Every colour, always moving.', level(8), 'legendary', 'rainbow'),
  item('name-effect', 'name-fire', 'On Fire', 'Flames lick at every letter.', streak(14), 'legendary', 'fire'),

  // Streak flame colours (the art key is a flame colour).
  item('streak-flame', 'flame-classic', 'Classic', 'The orange flame everyone starts with.', null, 'common', 'classic'),
  item('streak-flame', 'flame-blue', 'Blue Flame', 'Hotter than it looks.', streak(3), 'common', 'blue'),
  item('streak-flame', 'flame-green', 'Toxic Green', 'A flame with a bit of mischief.', streak(5), 'common', 'green'),
  item('streak-flame', 'flame-purple', 'Purple Haze', 'For the night-time coders.', streak(7), 'rare', 'purple'),
  item('streak-flame', 'flame-pink', 'Pink Blaze', 'Bright, bold and impossible to miss.', lessons(10), 'rare', 'pink'),
  item('streak-flame', 'flame-white', 'White Hot', 'The hottest flame there is.', streak(14), 'rare', 'white'),
  item('streak-flame', 'flame-gold', 'Golden Flame', 'Pure gold, for the dedicated.', level(6), 'legendary', 'gold'),
  item('streak-flame', 'flame-rainbow', 'Rainbow Fire', 'A month of streaks, in every colour.', streak(30), 'legendary', 'rainbow'),
];

/** What each slot holds before the learner picks anything. */
export const DEFAULT_EQUIPPED: Readonly<Record<StoreItemKind, string>> = {
  theme: 'theme-coddify',
  tutor: 'tutor-bit',
  title: 'bit-apprentice',
  frame: 'frame-none',
  'name-effect': 'name-plain',
  'streak-flame': 'flame-classic',
};
