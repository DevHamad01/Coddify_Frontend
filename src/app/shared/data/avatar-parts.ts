/**
 * Options for the learner's cartoon avatar. A first version of the avatar builder: the full
 * Bitmoji-style builder (faces, outfits, accessories) comes later with the backend.
 */
export interface AvatarLook {
  readonly skin: string;
  readonly hair: 'short' | 'curly' | 'long' | 'bun' | 'none';
  readonly hairColor: string;
  readonly shirt: string;
  readonly glasses: boolean;
  readonly background: string;
}

export const SKIN_TONES: readonly string[] = [
  '#FAD7B5',
  '#F1C27D',
  '#E0AC69',
  '#C68642',
  '#A86B3C',
  '#8D5524',
];

export const HAIR_STYLES: readonly AvatarLook['hair'][] = ['short', 'curly', 'long', 'bun', 'none'];

export const HAIR_COLORS: readonly string[] = [
  '#1F1A17',
  '#4B2E1E',
  '#8B5A2B',
  '#D4A055',
  '#B33A3A',
  '#6B7280',
];

export const SHIRT_COLORS: readonly string[] = [
  '#14B8A6',
  '#38BDF8',
  '#8B5CF6',
  '#F472B6',
  '#F59E0B',
  '#22C55E',
  '#374151',
];

export const AVATAR_BACKGROUNDS: readonly string[] = [
  'linear-gradient(135deg, #14B8A6, #38BDF8)',
  'linear-gradient(135deg, #8B5CF6, #EC4899)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #22C55E, #14B8A6)',
  'linear-gradient(135deg, #1F2937, #4B5563)',
];

export const DEFAULT_AVATAR: AvatarLook = {
  skin: SKIN_TONES[1],
  hair: 'short',
  hairColor: HAIR_COLORS[1],
  shirt: SHIRT_COLORS[0],
  glasses: false,
  background: AVATAR_BACKGROUNDS[0],
};
