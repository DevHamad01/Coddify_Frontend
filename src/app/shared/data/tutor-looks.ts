/** How each AI tutor character looks. Keys match the store item `art` of the tutor items. */
export interface TutorLook {
  readonly name: string;
  /** Head and body plating. */
  readonly shell: string;
  /** Darker shade of the shell for the body and outlines. */
  readonly shade: string;
  /** Ear pods, antenna and trims. */
  readonly accent: string;
  readonly visor: string;
  readonly eyes: string;
  readonly hat: 'none' | 'bow' | 'beanie' | 'grad-cap' | 'moon';
  readonly glasses: boolean;
  readonly headphones: boolean;
  /** Eyelashes on the visor eyes. */
  readonly lashes: boolean;
}

export const TUTOR_LOOKS: Readonly<Record<string, TutorLook>> = {
  bit: {
    name: 'Bit',
    shell: '#F4F2FC',
    shade: '#D9D4F0',
    accent: '#7FD4FF',
    visor: '#17142B',
    eyes: '#C9A6FF',
    hat: 'none',
    glasses: false,
    headphones: true,
    lashes: false,
  },
  nova: {
    name: 'Nova',
    shell: '#FBCFE8',
    shade: '#F5A3CF',
    accent: '#EC4899',
    visor: '#3B0A2A',
    eyes: '#FDF2F8',
    hat: 'bow',
    glasses: false,
    headphones: false,
    lashes: true,
  },
  byte: {
    name: 'Byte',
    shell: '#2E2E2E',
    shade: '#1C1C1C',
    accent: '#22D3EE',
    visor: '#050505',
    eyes: '#22D3EE',
    hat: 'none',
    glasses: false,
    headphones: true,
    lashes: false,
  },
  pixel: {
    name: 'Pixel',
    shell: '#FDE68A',
    shade: '#F5C451',
    accent: '#FB923C',
    visor: '#1F2937',
    eyes: '#FDE68A',
    hat: 'beanie',
    glasses: false,
    headphones: false,
    lashes: false,
  },
  sage: {
    name: 'Sage',
    shell: '#D1FAE5',
    shade: '#A7E8C9',
    accent: '#10B981',
    visor: '#064E3B',
    eyes: '#A7F3D0',
    hat: 'none',
    glasses: true,
    headphones: false,
    lashes: false,
  },
  ada: {
    name: 'Professor Ada',
    shell: '#EDE9FE',
    shade: '#D2C9FB',
    accent: '#8B5CF6',
    visor: '#1E1B4B',
    eyes: '#C4B5FD',
    hat: 'grad-cap',
    glasses: true,
    headphones: false,
    lashes: true,
  },
  luna: {
    name: 'Luna',
    shell: '#3730A3',
    shade: '#28237A',
    accent: '#A5B4FC',
    visor: '#0B0A23',
    eyes: '#FDE68A',
    hat: 'moon',
    glasses: false,
    headphones: false,
    lashes: true,
  },
  max: {
    name: 'Max',
    shell: '#FBBF24',
    shade: '#E0A00F',
    accent: '#111827',
    visor: '#111827',
    eyes: '#FDE68A',
    hat: 'none',
    glasses: false,
    headphones: true,
    lashes: false,
  },
};

export function tutorLook(key: string): TutorLook {
  return TUTOR_LOOKS[key] ?? TUTOR_LOOKS['bit'];
}
