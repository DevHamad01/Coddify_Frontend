import { JourneyNodeKind, Lesson } from '../learning.models';

/**
 * Mock content for "Python · Fundamentals", the course the demo account is enrolled in.
 * The backend will serve the same shapes from the database.
 */
export interface MockChapter {
  readonly id: string;
  readonly title: string;
  readonly nodes: readonly {
    readonly id: string;
    readonly title: string;
    readonly kind: JourneyNodeKind;
    readonly xp: number;
  }[];
}

export const PYTHON_SECTION = { number: 1, title: 'Fundamentals' } as const;

export const PYTHON_CHAPTERS: readonly MockChapter[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    nodes: [
      { id: 'py-the-language', title: 'The Language', kind: 'lesson', xp: 35 },
      { id: 'py-comments', title: 'Comments', kind: 'lesson', xp: 35 },
      { id: 'py-intro-quiz', title: 'Quick Check', kind: 'quiz', xp: 25 },
      { id: 'py-intro-chest', title: 'Chapter Reward', kind: 'chest', xp: 0 },
    ],
  },
  {
    id: 'variables',
    title: 'Variables',
    nodes: [
      { id: 'py-variables', title: 'Variables', kind: 'lesson', xp: 35 },
      { id: 'py-naming', title: 'Naming Rules', kind: 'lesson', xp: 35 },
      { id: 'py-reassign', title: 'Practice: Reassign', kind: 'practice', xp: 40 },
      { id: 'py-variables-chest', title: 'Chapter Reward', kind: 'chest', xp: 0 },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers & Math',
    nodes: [
      { id: 'py-numbers', title: 'Numbers', kind: 'lesson', xp: 35 },
      { id: 'py-operators', title: 'Operators', kind: 'lesson', xp: 35 },
      { id: 'py-math-practice', title: 'Practice: Shopping Bill', kind: 'practice', xp: 40 },
      { id: 'py-numbers-chest', title: 'Chapter Reward', kind: 'chest', xp: 0 },
    ],
  },
  {
    id: 'strings',
    title: 'Strings',
    nodes: [
      { id: 'py-strings', title: 'Strings', kind: 'lesson', xp: 35 },
      { id: 'py-fstrings', title: 'f-strings', kind: 'lesson', xp: 35 },
      { id: 'py-strings-quiz', title: 'Quick Check', kind: 'quiz', xp: 25 },
      { id: 'py-strings-chest', title: 'Chapter Reward', kind: 'chest', xp: 0 },
    ],
  },
];

type LessonSeed = Omit<
  Lesson,
  'courseId' | 'editorLanguage' | 'fileName' | 'nextLessonId' | 'chapterTitle'
>;

const SEEDS: readonly LessonSeed[] = [
  {
    id: 'py-the-language',
    title: 'The Language',
    summary: 'Python reads almost like English, which is why it is a great first language.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: "**Python** is one of the world's easiest and most popular programming languages.",
      },
      {
        type: 'paragraph',
        text: 'It powers websites, data science, AI, automation scripts and even games. Big companies and small startups both use it every day.',
      },
      {
        type: 'paragraph',
        text: 'A Python program is just a list of instructions that run from top to bottom. The `print()` function shows a value on the screen:',
      },
      { type: 'code', code: 'print("Hello Python!")' },
      {
        type: 'tip',
        text: 'Text in Python goes inside quotes. Both "double" and \'single\' quotes work.',
      },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Welcome to your first Python program! The code is already written for you.',
      steps: [
        'Look at the code: `print("Hello Python!")`',
        'Press the **Run Code** button to execute it',
        'You should see "Hello Python!" appear in the output',
      ],
      starterCode: '# Run this code to see the result:\nprint("Hello Python!")\n',
      solution: 'print("Hello Python!")\n',
      tests: [{ id: 't1', label: 'Any output passes', expectedOutput: null }],
    },
    reference: [
      {
        title: 'print()',
        body: 'Shows one or more values in the output, separated by spaces.',
        code: 'print("Hi", 42)',
      },
    ],
  },
  {
    id: 'py-comments',
    title: 'Comments',
    summary: 'Notes in your code that Python ignores.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'A **comment** starts with `#`. Python skips everything after it on that line, so comments are notes for humans.',
      },
      {
        type: 'code',
        code: '# This line is ignored\nprint("This line runs")  # a note at the end',
      },
      {
        type: 'paragraph',
        text: 'Good comments explain *why* the code does something, not what every line does.',
      },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'The program prints two lines, but only one of them should run.',
      steps: [
        'Turn the second `print` into a comment by adding `#` in front of it',
        'Run the code',
      ],
      starterCode: 'print("Keep me")\nprint("Hide me")\n',
      solution: 'print("Keep me")\n# print("Hide me")\n',
      tests: [{ id: 't1', label: 'Only "Keep me" is printed', expectedOutput: 'Keep me' }],
    },
    reference: [
      {
        title: '# comment',
        body: 'Everything after # on a line is ignored by Python.',
        code: '# like this',
      },
    ],
  },
  {
    id: 'py-intro-quiz',
    title: 'Quick Check',
    summary: 'Use what you learned so far.',
    xp: 25,
    content: [
      {
        type: 'paragraph',
        text: 'Time to put `print()` and comments together. No new ideas, just practice.',
      },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Write a program that introduces you.',
      steps: [
        'Print `I am learning Python`',
        'Add a comment above it that says what the program does',
      ],
      starterCode: '# Write your code below\n',
      solution: '# Introduce myself\nprint("I am learning Python")\n',
      tests: [{ id: 't1', label: 'Prints the sentence', expectedOutput: 'I am learning Python' }],
    },
    reference: [{ title: 'print()', body: 'Shows a value in the output.', code: 'print("text")' }],
  },
  {
    id: 'py-variables',
    title: 'Variables',
    summary: 'Give a value a name so you can use it again.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'A **variable** is a name that points to a value. You create one with `=`:',
      },
      { type: 'code', code: 'city = "Lahore"\nprint(city)' },
      {
        type: 'paragraph',
        text: 'Read `=` as "is now". The name goes on the left, the value on the right.',
      },
      { type: 'tip', text: 'Use a variable when you need the same value more than once.' },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Store your favourite language in a variable and print it.',
      steps: [
        'Create a variable `language` with the value `"Python"`',
        'Print the variable (not the text directly)',
      ],
      starterCode: '# Create the variable here\n\nprint(language)\n',
      solution: 'language = "Python"\nprint(language)\n',
      tests: [{ id: 't1', label: 'Prints Python', expectedOutput: 'Python' }],
    },
    reference: [
      {
        title: 'Assignment',
        body: 'name = value creates or updates a variable.',
        code: 'score = 10',
      },
    ],
  },
  {
    id: 'py-naming',
    title: 'Naming Rules',
    summary: 'What a valid, readable variable name looks like.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'Names can use letters, digits and underscores, but cannot start with a digit. Python uses `snake_case` for multi-word names.',
      },
      { type: 'code', code: 'first_name = "Sara"\nlevel_2 = True' },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Fix the variable name so the program runs.',
      steps: ['Rename `user name` to `user_name` on both lines', 'Run the code'],
      starterCode: 'user name = "Bilal"\nprint(user name)\n',
      solution: 'user_name = "Bilal"\nprint(user_name)\n',
      tests: [{ id: 't1', label: 'Prints Bilal', expectedOutput: 'Bilal' }],
    },
    reference: [
      {
        title: 'snake_case',
        body: 'Lowercase words joined with underscores.',
        code: 'total_price = 99',
      },
    ],
  },
  {
    id: 'py-reassign',
    title: 'Practice: Reassign',
    summary: 'Variables can change.',
    xp: 40,
    content: [{ type: 'paragraph', text: 'Assigning to an existing name replaces its value.' }],
    challenge: {
      level: 'Easy',
      intro: 'A learner finished a lesson. Update their XP.',
      steps: ['Set `xp` to `xp + 35`', 'Print `xp`'],
      starterCode: 'xp = 100\n# add 35 to xp\n\nprint(xp)\n',
      solution: 'xp = 100\nxp = xp + 35\nprint(xp)\n',
      tests: [{ id: 't1', label: 'Prints 135', expectedOutput: '135' }],
    },
    reference: [
      { title: 'Reassignment', body: 'x = x + 1 reads the old value, then stores the new one.' },
    ],
  },
  {
    id: 'py-numbers',
    title: 'Numbers',
    summary: 'Whole numbers and decimals.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'Python has `int` for whole numbers and `float` for decimals. Numbers never go in quotes.',
      },
      { type: 'code', code: 'apples = 12\nprice = 2.5\nprint(apples, price)' },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Print how many days are in 3 weeks.',
      steps: ['Create `weeks = 3`', 'Print `weeks * 7`'],
      starterCode: 'weeks = 3\n',
      solution: 'weeks = 3\nprint(weeks * 7)\n',
      tests: [{ id: 't1', label: 'Prints 21', expectedOutput: '21' }],
    },
    reference: [{ title: 'int and float', body: '7 is an int, 7.0 is a float.' }],
  },
  {
    id: 'py-operators',
    title: 'Operators',
    summary: '+ - * / // % and **.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: '`//` divides and drops the remainder, `%` gives the remainder, `**` raises to a power.',
      },
      { type: 'code', code: 'print(17 // 5)  # 3\nprint(17 % 5)   # 2\nprint(2 ** 10)  # 1024' },
    ],
    challenge: {
      level: 'Easy',
      intro: '125 minutes: how many full hours, and how many minutes left over?',
      steps: ['Print `125 // 60`', 'Print `125 % 60` on the next line'],
      starterCode: 'minutes = 125\n',
      solution: 'minutes = 125\nprint(minutes // 60)\nprint(minutes % 60)\n',
      tests: [{ id: 't1', label: 'Prints 2 then 5', expectedOutput: '2\n5' }],
    },
    reference: [{ title: 'Operators', body: '// floor division, % remainder, ** power.' }],
  },
  {
    id: 'py-math-practice',
    title: 'Practice: Shopping Bill',
    summary: 'Put numbers and variables together.',
    xp: 40,
    content: [
      {
        type: 'paragraph',
        text: 'Real programs mix variables and arithmetic. Let us total a bill.',
      },
    ],
    challenge: {
      level: 'Easy',
      intro: 'Three notebooks cost 120 each and a pen costs 45.',
      steps: ['Store the prices in variables', 'Print the total cost'],
      starterCode: 'notebook = 120\npen = 45\n',
      solution: 'notebook = 120\npen = 45\nprint(notebook * 3 + pen)\n',
      tests: [{ id: 't1', label: 'Prints 405', expectedOutput: '405' }],
    },
    reference: [{ title: 'Order of operations', body: '* and / happen before + and -.' }],
  },
  {
    id: 'py-strings',
    title: 'Strings',
    summary: 'Working with text.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'A **string** is text in quotes. `+` joins strings and `*` repeats them.',
      },
      { type: 'code', code: 'print("Cod" + "dify")\nprint("ha" * 3)' },
    ],
    challenge: {
      level: 'Beginner',
      intro: 'Build a greeting from two variables.',
      steps: ['Join `greeting`, a space and `name`', 'Print the result'],
      starterCode: 'greeting = "Salam"\nname = "Ahmed"\n',
      solution: 'greeting = "Salam"\nname = "Ahmed"\nprint(greeting + " " + name)\n',
      tests: [{ id: 't1', label: 'Prints Salam Ahmed', expectedOutput: 'Salam Ahmed' }],
    },
    reference: [{ title: 'Concatenation', body: '"a" + "b" gives "ab".' }],
  },
  {
    id: 'py-fstrings',
    title: 'f-strings',
    summary: 'Drop values straight into text.',
    xp: 35,
    content: [
      {
        type: 'paragraph',
        text: 'Put `f` before the quotes and wrap values in `{}`. Python fills them in.',
      },
      {
        type: 'code',
        code: 'name = "Zara"\nstreak = 7\nprint(f"{name} has a {streak} day streak")',
      },
    ],
    challenge: {
      level: 'Easy',
      intro: 'Print a progress message with an f-string.',
      steps: ['Use `lessons` and `total` inside an f-string', 'Print `Done 3 of 10 lessons`'],
      starterCode: 'lessons = 3\ntotal = 10\n',
      solution: 'lessons = 3\ntotal = 10\nprint(f"Done {lessons} of {total} lessons")\n',
      tests: [{ id: 't1', label: 'Prints the message', expectedOutput: 'Done 3 of 10 lessons' }],
    },
    reference: [{ title: 'f-string', body: 'f"text {value}" inserts value into the text.' }],
  },
  {
    id: 'py-strings-quiz',
    title: 'Quick Check',
    summary: 'Strings recap.',
    xp: 25,
    content: [{ type: 'paragraph', text: 'One last exercise for this section.' }],
    challenge: {
      level: 'Easy',
      intro: 'Print a 10-character divider line.',
      steps: ['Repeat `"-"` 10 times with `*`', 'Print it'],
      starterCode: '',
      solution: 'print("-" * 10)\n',
      tests: [{ id: 't1', label: 'Prints ----------', expectedOutput: '----------' }],
    },
    reference: [{ title: 'Repetition', body: '"ab" * 2 gives "abab".' }],
  },
];

const ORDER = PYTHON_CHAPTERS.flatMap((chapter) =>
  chapter.nodes
    .filter((node) => node.kind !== 'chest')
    .map((node) => ({ id: node.id, chapter: chapter.title })),
);

export const PYTHON_LESSONS: ReadonlyMap<string, Lesson> = new Map(
  SEEDS.map((seed) => {
    const index = ORDER.findIndex((entry) => entry.id === seed.id);
    return [
      seed.id,
      {
        ...seed,
        courseId: 'python',
        editorLanguage: 'python',
        fileName: 'main.py',
        chapterTitle: ORDER[index]?.chapter ?? '',
        nextLessonId: ORDER[index + 1]?.id ?? null,
      } satisfies Lesson,
    ];
  }),
);
