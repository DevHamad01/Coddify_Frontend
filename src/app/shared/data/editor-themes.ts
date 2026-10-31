/**
 * Dark editor themes a learner can unlock in the store, keyed by store item id. Each becomes a
 * Monaco theme of the same name; the store draws its swatch from the same colours.
 */
export interface EditorPalette {
  readonly background: string;
  readonly foreground: string;
  readonly lineHighlight: string;
  readonly keyword: string;
  readonly string: string;
  readonly number: string;
  readonly comment: string;
  readonly function: string;
  readonly cursor: string;
}

export const EDITOR_THEMES: Readonly<Record<string, EditorPalette>> = {
  'theme-coddify': {
    background: '#1E1E1E',
    foreground: '#D4D4D4',
    lineHighlight: '#2A2A2A',
    keyword: '#C586C0',
    string: '#CE9178',
    number: '#B5CEA8',
    comment: '#6A9955',
    function: '#DCDCAA',
    cursor: '#14B8A6',
  },
  'theme-midnight': {
    background: '#0F1226',
    foreground: '#D6DAF5',
    lineHighlight: '#181C38',
    keyword: '#A78BFA',
    string: '#86EFAC',
    number: '#F9A8D4',
    comment: '#5B6290',
    function: '#93C5FD',
    cursor: '#A78BFA',
  },
  'theme-ocean': {
    background: '#0B1E2D',
    foreground: '#CFE6F5',
    lineHighlight: '#12293C',
    keyword: '#38BDF8',
    string: '#5EEAD4',
    number: '#FCD34D',
    comment: '#4C6E86',
    function: '#7DD3FC',
    cursor: '#38BDF8',
  },
  'theme-forest': {
    background: '#122019',
    foreground: '#D7E8DC',
    lineHighlight: '#1A2C23',
    keyword: '#86EFAC',
    string: '#FDE68A',
    number: '#FDBA74',
    comment: '#5C7A66',
    function: '#BEF264',
    cursor: '#4ADE80',
  },
  'theme-sunset': {
    background: '#22121F',
    foreground: '#F5DCE6',
    lineHighlight: '#2E1A2A',
    keyword: '#FB923C',
    string: '#F9A8D4',
    number: '#FDE047',
    comment: '#7E5A70',
    function: '#FDBA74',
    cursor: '#FB7185',
  },
  'theme-neon': {
    background: '#050505',
    foreground: '#E5E5E5',
    lineHighlight: '#141414',
    keyword: '#FF2E97',
    string: '#00F5D4',
    number: '#FEE440',
    comment: '#555555',
    function: '#00BBF9',
    cursor: '#FF2E97',
  },
  'theme-vampire': {
    background: '#282A36',
    foreground: '#F8F8F2',
    lineHighlight: '#343746',
    keyword: '#FF79C6',
    string: '#F1FA8C',
    number: '#BD93F9',
    comment: '#6272A4',
    function: '#50FA7B',
    cursor: '#FF79C6',
  },
  'theme-solar': {
    background: '#1C1608',
    foreground: '#F3E7C6',
    lineHighlight: '#29200C',
    keyword: '#F59E0B',
    string: '#FDE68A',
    number: '#FB923C',
    comment: '#7C6A3E',
    function: '#FACC15',
    cursor: '#F59E0B',
  },
};

export const DEFAULT_EDITOR_THEME = 'theme-coddify';
