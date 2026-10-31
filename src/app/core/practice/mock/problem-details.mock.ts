import { TechId } from '../../../shared/data/tech';
import {
  Difficulty,
  ProblemDetail,
  ProblemParam,
  ProblemSolution,
  ProblemTest,
  SimilarProblem,
  WorkspaceLanguage,
} from '../practice.models';

/**
 * Content for the problem workspace. "Reverse a String" is written out in full as the reference
 * shape; every other problem gets a generated statement until the admin panel authors them.
 */

export const WORKSPACE_LANGUAGES: readonly WorkspaceLanguage[] = [
  'python',
  'javascript',
  'java',
  'cpp',
];

const TYPE_NAMES: Record<WorkspaceLanguage, Record<string, string>> = {
  python: { string: 'str', int: 'int', 'int[]': 'list[int]', bool: 'bool' },
  javascript: { string: '', int: '', 'int[]': '', bool: '' },
  java: { string: 'String', int: 'int', 'int[]': 'int[]', bool: 'boolean' },
  cpp: { string: 'string', int: 'int', 'int[]': 'vector<int>', bool: 'bool' },
};

/** Function stub in each language with a placeholder body that returns the first argument. */
export function starterFor(
  name: string,
  params: readonly ProblemParam[],
  returns: string,
): Record<WorkspaceLanguage, string> {
  const first = params[0]?.name ?? 'x';
  const args = (language: WorkspaceLanguage, typed: 'before' | 'after' | 'none') =>
    params
      .map((param) => {
        const type = TYPE_NAMES[language][param.type] ?? param.type;
        if (typed === 'before') {
          return `${type} ${param.name}`;
        }
        return typed === 'after' && type ? `${param.name}: ${type}` : param.name;
      })
      .join(', ');
  const java = TYPE_NAMES.java[returns] ?? returns;
  const cpp = TYPE_NAMES.cpp[returns] ?? returns;
  return {
    python: `def ${name}(${args('python', 'none')}):\n    # Write code here\n    return ${first}\n`,
    javascript: `function ${name}(${args('javascript', 'none')}) {\n  // Write code here\n  return ${first};\n}\n`,
    java: `class Solution {\n    public ${java} ${name}(${args('java', 'before')}) {\n        // Write code here\n        return ${first};\n    }\n}\n`,
    cpp: `${cpp} ${name}(${args('cpp', 'before')}) {\n    // Write code here\n    return ${first};\n}\n`,
  };
}

const REVERSE_SOLUTION: ProblemSolution = {
  summary:
    'Every character has a fixed destination: the one at index `i` belongs at index `n-1-i`. Write the characters into a new string in that order, or swap them in pairs from both ends. The swap is the version interviewers ask for, because the same two pointer move reverses an array in place and checks a palindrome.',
  approaches: [
    { title: 'Copy the characters from the back', time: 'O(n)', space: 'O(n)' },
    { title: 'Swap from both ends with two pointers', time: 'O(n)', space: 'O(n)', best: true },
  ],
  intuition: [
    'The reverse starts with the last character and ends with the first, so loop an index from `n-1` down to `0` and append each character to the answer.',
    'Append to a list or a string builder and join once at the end. Adding one character to an immutable string with `+` copies the whole string each time.',
  ],
  steps: [
    'Create an empty list or string builder for the answer.',
    'Loop `i` from `n-1` down to `0`.',
    'Append `s[i]` to the answer.',
    'Join the answer into a string and return it.',
  ],
  code: {
    python:
      'def reverseString(s):\n    result = []\n    for i in range(len(s) - 1, -1, -1):\n        result.append(s[i])\n    return "".join(result)\n',
    javascript:
      'function reverseString(s) {\n  const chars = s.split("");\n  let left = 0, right = chars.length - 1;\n  while (left < right) {\n    [chars[left], chars[right]] = [chars[right], chars[left]];\n    left++;\n    right--;\n  }\n  return chars.join("");\n}\n',
    java: 'class Solution {\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}\n',
    cpp: 'string reverseString(string s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) swap(s[left++], s[right--]);\n    return s;\n}\n',
  },
  pitfalls: [
    'Looping `left` all the way to `n-1`. Past the middle every pair is swapped back and the string comes back unchanged. Stop at `left < right`.',
    'Starting the backward loop at `n` instead of `n-1`, which reads one position past the end.',
    'Swapping without a temporary variable. After `chars[left] = chars[right]` the old left character is gone.',
  ],
  faqs: [
    {
      question: 'What is the time complexity of reversing a string?',
      answer: 'O(n): every character is read once and written once.',
    },
    {
      question: 'How do you reverse a string without a built-in reverse function?',
      answer: 'Walk two pointers from both ends towards the middle and swap the characters they point at.',
    },
    {
      question: 'Can you reverse a string in place?',
      answer:
        'Only if the language lets you change the characters (C++, or a char array in Java). Python and JavaScript strings are immutable, so you build a new one.',
    },
  ],
};

const REVERSE_A_STRING: Omit<ProblemDetail, 'id' | 'status' | 'similar'> = {
  title: 'Reverse a String',
  difficulty: 'Beginner',
  topics: ['Arrays and strings', 'Two pointers'],
  statement: [
    'You get a string `s` made of English letters and digits. Return a new string with the same characters in reverse order, so the last character comes first and the first comes last.',
    'Keep every character exactly as it is, including its case.',
  ],
  functionName: 'reverseString',
  params: [{ name: 's', type: 'string', description: 'the string to reverse' }],
  returns: { type: 'string', description: 'the characters of s in reverse order' },
  constraints: [
    '`1 ≤ s.length ≤ 10⁴`',
    '`s` contains only English letters (`a` to `z`, `A` to `Z`) and digits (`0` to `9`).',
  ],
  examples: [
    { input: 's = "Coddy2026"', output: '"6202yddoC"' },
    { input: 's = "abc"', output: '"cba"' },
    { input: 's = "A"', output: '"A"', explanation: 'A single character reads the same both ways.' },
  ],
  hints: [
    'The first character of the answer is the last character of `s`. Which index is that?',
    'Walk an index from the end of the string back to the start and collect each character.',
    'For the in-place version, put one pointer at each end, swap, and move them towards each other until they meet.',
  ],
  solution: REVERSE_SOLUTION,
  languages: WORKSPACE_LANGUAGES,
  defaultLanguage: 'python',
  starterCode: starterFor(
    'reverseString',
    [{ name: 's', type: 'string', description: '' }],
    'string',
  ),
  tests: [
    { id: 't1', args: '"Coddy2026"', expected: '6202yddoC' },
    { id: 't2', args: '"abc"', expected: 'cba' },
    { id: 't3', args: '"A"', expected: 'A' },
    { id: 't4', args: '"Racecar"', expected: 'racecaR' },
    { id: 't5', args: '"Pakistan14"', expected: '41natsikaP' },
  ],
};

/** Hand-written content by problem title. */
const WRITTEN: Readonly<Record<string, typeof REVERSE_A_STRING>> = {
  'Reverse a String': REVERSE_A_STRING,
};

const MONACO_FOR: Partial<Record<TechId, WorkspaceLanguage>> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
};

/** camelCase function name from a title: "Count Vowels" -> "countVowels". */
function functionNameFor(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  return words
    .slice(0, 4)
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

/** Generated workspace content for problems the team has not written up yet. */
export function generatedDetail(input: {
  title: string;
  difficulty: Difficulty;
  topic: string;
  language?: TechId;
}): Omit<ProblemDetail, 'id' | 'status' | 'similar'> {
  const written = WRITTEN[input.title];
  if (written) {
    return written;
  }
  const name = functionNameFor(input.title);
  const params: ProblemParam[] = [
    { name: 'data', type: 'string', description: 'the input described in the story' },
  ];
  const preferred = input.language ? MONACO_FOR[input.language] : undefined;
  const tests: ProblemTest[] = [1, 2, 3, 4, 5].map((n) => ({
    id: `t${n}`,
    args: `"sample-${n}"`,
    expected: `answer-${n}`,
  }));
  return {
    title: input.title,
    difficulty: input.difficulty,
    topics: [input.topic],
    statement: [
      `**${input.title}** is a ${input.difficulty.toLowerCase()} ${input.topic.toLowerCase()} problem. The full story and rules are being written by the Coddify team.`,
      `For now, read the examples, implement \`${name}\` and run the tests to see how the workspace works.`,
    ],
    functionName: name,
    params,
    returns: { type: 'string', description: 'the answer for this input' },
    constraints: ['`1 ≤ data.length ≤ 10⁵`'],
    examples: [
      { input: 'data = "sample-1"', output: '"answer-1"' },
      { input: 'data = "sample-2"', output: '"answer-2"' },
    ],
    hints: [
      'Start by writing down, in plain words, what the answer is for the first example.',
      `Most ${input.topic.toLowerCase()} problems get easier once you pick the right loop: what do you visit, and in which order?`,
      'Check the smallest possible input before you run the tests.',
    ],
    solution: {
      summary: `A full walkthrough for ${input.title} is on its way. Use the hints to get unstuck in the meantime.`,
      approaches: [{ title: 'Straightforward simulation', time: 'O(n)', space: 'O(1)', best: true }],
      intuition: ['Follow the rules of the story one step at a time and keep only what you need.'],
      steps: ['Read the input.', 'Apply the rule to each part.', 'Return the answer.'],
      code: {},
      pitfalls: ['Forgetting the smallest input (a single item).'],
      faqs: [],
    },
    languages: preferred ? [preferred] : WORKSPACE_LANGUAGES,
    defaultLanguage: preferred ?? 'python',
    starterCode: starterFor(name, params, 'string'),
    tests,
  };
}

export type SimilarSource = readonly SimilarProblem[];
