import { TechId, findTech } from '../../../shared/data/tech';
import { Lesson, MiniCourse } from '../learning.models';
import { MockChapter, PYTHON_CHAPTERS, PYTHON_LESSONS } from './python-course.mock';

/**
 * Mock syllabus for every course in the catalog. Python has real lesson content; every other
 * course gets a generated path with simple "say hello" lessons so it can be opened and played.
 * Admins will author the real courses later; the backend serves the same shapes.
 */

export interface MockSection {
  readonly title: string;
  readonly description: string;
  readonly lessonCount: number;
}

const PYTHON_SECTIONS: readonly MockSection[] = [
  {
    title: 'Fundamentals',
    description: 'Build a strong foundation with essential concepts and basic skills.',
    lessonCount: 77,
  },
  {
    title: 'Logic & Flow',
    description: 'Develop problem-solving skills and create dynamic, interactive programs.',
    lessonCount: 78,
  },
  {
    title: 'Object Oriented Programming',
    description: 'Organise code with classes, objects and reusable structures.',
    lessonCount: 64,
  },
];

/** Small deterministic hash so generated numbers stay the same on every load. */
function seed(text: string): number {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return hash;
}

export function sectionsFor(courseId: TechId): readonly MockSection[] {
  if (courseId === 'python') {
    return PYTHON_SECTIONS;
  }
  const name = findTech(courseId).name;
  const base = 40 + (seed(courseId) % 30);
  return [
    {
      title: 'Fundamentals',
      description: `Your first steps in ${name}: syntax, values and small programs.`,
      lessonCount: base,
    },
    {
      title: 'Logic & Flow',
      description: 'Decisions, loops and functions that make programs do real work.',
      lessonCount: base + 8,
    },
    {
      title: 'Building Projects',
      description: `Put it together: build and finish small ${name} projects.`,
      lessonCount: base - 6,
    },
  ];
}

const GENERIC_CHAPTERS = ['Introduction', 'Variables', 'Operators', 'Making Decisions'] as const;
const GENERIC_LESSONS: Record<(typeof GENERIC_CHAPTERS)[number], readonly string[]> = {
  Introduction: ['What is NAME?', 'Your First Program', 'Comments'],
  Variables: ['Storing Values', 'Naming Things', 'Changing Values'],
  Operators: ['Math Operators', 'Comparing Values', 'Combining Text'],
  'Making Decisions': ['If Statements', 'Else and Else If', 'Putting It Together'],
};

/** Course id is the prefix of every generated node id: `javascript~2~1`. */
const SEPARATOR = '~';

export function chaptersFor(courseId: TechId): readonly MockChapter[] {
  if (courseId === 'python') {
    return PYTHON_CHAPTERS;
  }
  const name = findTech(courseId).name;
  return GENERIC_CHAPTERS.map((title, c) => ({
    id: `${courseId}${SEPARATOR}${c}`,
    title,
    nodes: [
      ...GENERIC_LESSONS[title].map((lesson, n) => ({
        id: `${courseId}${SEPARATOR}${c}${SEPARATOR}${n}`,
        title: lesson.replace('NAME', name),
        kind: n === 2 ? ('practice' as const) : ('lesson' as const),
        xp: n === 2 ? 40 : 35,
      })),
      {
        id: `${courseId}${SEPARATOR}${c}${SEPARATOR}chest`,
        title: 'Chapter Reward',
        kind: 'chest' as const,
        xp: 0,
      },
    ],
  }));
}

/** Which course a node belongs to (python lessons use the "py-" prefix). */
export function courseOfNode(nodeId: string): TechId {
  return nodeId.includes(SEPARATOR) ? (nodeId.split(SEPARATOR)[0] as TechId) : 'python';
}

/** Monaco language id, file name and a "hello" line for each course's generated lessons. */
const EDITOR: Partial<Record<TechId, { language: string; file: string; hello: string }>> = {
  javascript: { language: 'javascript', file: 'main.js', hello: 'console.log("Hello, Coddify!");' },
  typescript: { language: 'typescript', file: 'main.ts', hello: 'console.log("Hello, Coddify!");' },
  nodejs: { language: 'javascript', file: 'main.js', hello: 'console.log("Hello, Coddify!");' },
  react: { language: 'javascript', file: 'App.js', hello: 'console.log("Hello, Coddify!");' },
  angular: { language: 'typescript', file: 'app.ts', hello: 'console.log("Hello, Coddify!");' },
  nextjs: { language: 'javascript', file: 'page.js', hello: 'console.log("Hello, Coddify!");' },
  java: {
    language: 'java',
    file: 'Main.java',
    hello: 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Coddify!");\n  }\n}',
  },
  cpp: {
    language: 'cpp',
    file: 'main.cpp',
    hello: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, Coddify!";\n  return 0;\n}',
  },
  c: {
    language: 'c',
    file: 'main.c',
    hello: '#include <stdio.h>\n\nint main() {\n  printf("Hello, Coddify!");\n  return 0;\n}',
  },
  csharp: {
    language: 'csharp',
    file: 'Program.cs',
    hello: 'Console.WriteLine("Hello, Coddify!");',
  },
  go: {
    language: 'go',
    file: 'main.go',
    hello: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Coddify!")\n}',
  },
  rust: { language: 'rust', file: 'main.rs', hello: 'fn main() {\n  println!("Hello, Coddify!");\n}' },
  php: { language: 'php', file: 'index.php', hello: '<?php\necho "Hello, Coddify!";' },
  sql: { language: 'sql', file: 'query.sql', hello: "SELECT 'Hello, Coddify!';" },
  html: { language: 'html', file: 'index.html', hello: '<h1>Hello, Coddify!</h1>' },
  css: { language: 'css', file: 'style.css', hello: 'h1 {\n  color: teal;\n}' },
};

const FALLBACK_EDITOR = { language: 'plaintext', file: 'main.txt', hello: 'Hello, Coddify!' };

export function editorFor(courseId: TechId) {
  return EDITOR[courseId] ?? FALLBACK_EDITOR;
}

/** Real Python lessons, or a generated lesson for any other course's node. */
export function lessonFor(lessonId: string): Lesson | undefined {
  const python = PYTHON_LESSONS.get(lessonId);
  if (python) {
    return python;
  }
  const courseId = courseOfNode(lessonId);
  if (courseId === 'python') {
    return undefined;
  }
  const chapters = chaptersFor(courseId);
  const order = chapters.flatMap((chapter) =>
    chapter.nodes
      .filter((node) => node.kind !== 'chest')
      .map((node) => ({ ...node, chapter: chapter.title })),
  );
  const index = order.findIndex((node) => node.id === lessonId);
  if (index < 0) {
    return undefined;
  }
  const node = order[index];
  const name = findTech(courseId).name;
  const editor = editorFor(courseId);
  return {
    id: node.id,
    courseId,
    chapterTitle: node.chapter,
    title: node.title,
    editorLanguage: editor.language,
    fileName: editor.file,
    summary: `${node.title} in ${name}.`,
    xp: node.xp,
    content: [
      {
        type: 'paragraph',
        text: `This **${name}** lesson is being written by the Coddify team. For now, warm up with the classic first program.`,
      },
      { type: 'code', code: editor.hello },
      { type: 'tip', text: 'Run the code, then change the message to your own name.' },
    ],
    challenge: {
      level: 'Beginner',
      intro: `Say hello from ${name}.`,
      steps: ['Read the starter code', 'Press **Run Code**', 'Change the message and run it again'],
      starterCode: editor.hello + '\n',
      solution: editor.hello + '\n',
      tests: [{ id: 't1', label: 'The program runs', expectedOutput: null }],
    },
    reference: [],
    nextLessonId: order[index + 1]?.id ?? null,
  };
}

/** Number of playable (non-chest) nodes in a course's mock path. */
export function playableNodeIds(courseId: TechId): readonly string[] {
  return chaptersFor(courseId).flatMap((chapter) =>
    chapter.nodes.filter((node) => node.kind !== 'chest').map((node) => node.id),
  );
}

const PYTHON_MORE: readonly MiniCourse[] = [
  {
    id: 'py-hold-the-keep',
    title: 'Pygame Project: Hold the Keep',
    description: 'Build a whole survival game: a knight holds a castle courtyard through the night.',
    lessonCount: 20,
    certificate: false,
    tags: ['Projects', 'Games'],
  },
  {
    id: 'py-pygame-games',
    title: 'Make Games with Pygame',
    description: 'Five small games: move a square, catch falling blocks, Snake and two-player Pong.',
    lessonCount: 40,
    certificate: true,
    tags: ['Projects', 'Games'],
  },
  {
    id: 'py-avl-tree',
    title: 'AVL Tree - Data Structures',
    description: 'Build a self-balancing binary search tree and keep every lookup fast.',
    lessonCount: 16,
    certificate: true,
    tags: ['Data Structures', 'Interview Preparation'],
  },
  {
    id: 'py-prim',
    title: "Prim's Algorithm - Graphs",
    description: 'Grow a minimum spanning tree one cheapest edge at a time.',
    lessonCount: 9,
    certificate: true,
    tags: ['Graph Algorithms', 'Interview Preparation'],
  },
  {
    id: 'py-kruskal',
    title: "Kruskal's Algorithm - Graphs",
    description: 'Sort the edges, union-find the sets and build an MST.',
    lessonCount: 9,
    certificate: true,
    tags: ['Graph Algorithms'],
  },
  {
    id: 'py-dijkstra',
    title: "Dijkstra's Algorithm - Graphs",
    description: 'Shortest paths from one start with a priority queue.',
    lessonCount: 9,
    certificate: true,
    tags: ['Graph Algorithms', 'Interview Preparation'],
  },
  {
    id: 'py-automation',
    title: 'Automate Boring Tasks',
    description: 'Rename files, read spreadsheets and send reports with short scripts.',
    lessonCount: 24,
    certificate: true,
    tags: ['Projects'],
  },
  {
    id: 'py-data-basics',
    title: 'Data Analysis Basics',
    description: 'Load a CSV, clean it and answer questions with lists and dicts.',
    lessonCount: 18,
    certificate: true,
    tags: ['Data Structures'],
  },
  {
    id: 'py-recursion',
    title: 'Recursion from Zero',
    description: 'Functions that call themselves, explained with pictures and small puzzles.',
    lessonCount: 12,
    certificate: true,
    tags: ['Interview Preparation'],
  },
  {
    id: 'py-cli-todo',
    title: 'Project: Command Line To-Do',
    description: 'A to-do app in the terminal that saves your tasks to a file.',
    lessonCount: 14,
    certificate: false,
    tags: ['Projects'],
  },
];

export function moreCoursesFor(courseId: TechId): readonly MiniCourse[] {
  if (courseId === 'python') {
    return PYTHON_MORE;
  }
  const name = findTech(courseId).name;
  return [
    {
      id: `${courseId}-projects`,
      title: `${name} Mini Projects`,
      description: `Three small ${name} projects to practise everything from the fundamentals.`,
      lessonCount: 18,
      certificate: true,
      tags: ['Projects'],
    },
    {
      id: `${courseId}-interview`,
      title: `${name} Interview Warm-up`,
      description: 'The questions interviewers ask most, solved step by step.',
      lessonCount: 12,
      certificate: true,
      tags: ['Interview Preparation'],
    },
    {
      id: `${courseId}-data-structures`,
      title: `Data Structures in ${name}`,
      description: 'Arrays, stacks, queues and maps, built and used from scratch.',
      lessonCount: 20,
      certificate: true,
      tags: ['Data Structures'],
    },
  ];
}
