import { TechId } from '../../shared/data/tech';
import { IconName } from '../../shared/ui/icon/icons';

/**
 * Blog articles. Static content for now; the admin panel will author posts later
 * through the same shape.
 */
export type BlogCategory =
  | 'Coding for beginners'
  | 'Inside Coddify'
  | 'Careers'
  | 'Data structures & algorithms'
  | 'Artificial intelligence';

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'Coding for beginners',
  'Inside Coddify',
  'Careers',
  'Data structures & algorithms',
  'Artificial intelligence',
];

/** Article body. Text supports **bold**, `code` and *italic*. */
export type BlogBlock =
  | { readonly kind: 'p'; readonly text: string }
  | { readonly kind: 'h2'; readonly id: string; readonly text: string }
  | { readonly kind: 'list'; readonly items: readonly string[]; readonly ordered?: boolean }
  | { readonly kind: 'code'; readonly language: string; readonly code: string }
  | { readonly kind: 'tip'; readonly text: string };

export interface BlogCover {
  /** Card background. */
  readonly color: string;
  readonly icon: IconName;
  readonly tech?: TechId;
}

export interface BlogPost {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: BlogCategory;
  readonly author: string;
  /** ISO date. */
  readonly date: string;
  readonly readMinutes: number;
  readonly cover: BlogCover;
  readonly body: readonly BlogBlock[];
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'build-a-coding-habit',
    title: 'How to Build a Coding Habit in 10 Minutes a Day',
    excerpt:
      'Most people quit learning to code because they aim too high. Here is how to make coding something you do every day without burning out.',
    category: 'Coding for beginners',
    author: 'Coddify Team',
    date: '2026-10-28',
    readMinutes: 6,
    cover: { color: '#0f766e', icon: 'flame' },
    body: [
      {
        kind: 'p',
        text: 'Learning to code is not hard because the ideas are impossible. It is hard because it takes months, and most plans fall apart in the first two weeks. The fix is not more motivation. It is a smaller, steadier habit.',
      },
      { kind: 'h2', id: 'start-small', text: 'Start smaller than feels useful' },
      {
        kind: 'p',
        text: 'A goal of "two hours every evening" survives about three evenings. A goal of **one lesson a day** survives exams, family events and bad days. Ten focused minutes beat a two-hour session you keep postponing.',
      },
      {
        kind: 'tip',
        text: 'Set your daily goal in Coddify to the smallest number you could hit on your worst day. You can always do more.',
      },
      { kind: 'h2', id: 'same-time', text: 'Attach it to something you already do' },
      {
        kind: 'p',
        text: 'Habits stick when they have a trigger. Do your lesson right after chai, on the bus ride home or before you open social media. The trigger matters more than the time of day.',
      },
      { kind: 'h2', id: 'protect-streak', text: 'Protect the streak, not the session' },
      {
        kind: 'list',
        items: [
          'On busy days, do one short lesson and stop. The streak is the win.',
          'Missed a day? Start again tomorrow. One gap does not undo weeks of progress.',
          'Review old lessons when you are tired. Practice still counts.',
        ],
      },
      { kind: 'h2', id: 'make-it-real', text: 'Build something tiny every week' },
      {
        kind: 'p',
        text: 'Lessons teach the pieces; small projects make them stick. Once a week, use what you learned to build something silly: a tip calculator, a quiz about your friends, a program that prints your timetable. Finishing small things is what makes you feel like a programmer.',
      },
    ],
  },
  {
    slug: 'python-or-javascript-first',
    title: 'Python or JavaScript: Which Should You Learn First?',
    excerpt:
      'Both are great first languages. The right one depends on what you want to build. A short guide to choosing without overthinking it.',
    category: 'Coding for beginners',
    author: 'Coddify Team',
    date: '2026-10-21',
    readMinutes: 7,
    cover: { color: '#1d4ed8', icon: 'code', tech: 'python' },
    body: [
      {
        kind: 'p',
        text: 'This is the most common question beginners ask, and the honest answer is: **it matters less than you think**. The concepts you learn first, like variables, loops, functions and debugging, carry over to every language.',
      },
      { kind: 'h2', id: 'python', text: 'Pick Python if...' },
      {
        kind: 'list',
        items: [
          'You want the gentlest syntax to start with.',
          'You are interested in data, automation, AI or university assignments.',
          'You prefer seeing results in a console before worrying about design.',
        ],
      },
      {
        kind: 'code',
        language: 'python',
        code: 'names = ["Ali", "Sara", "Zain"]\nfor name in names:\n    print(f"Salam, {name}!")',
      },
      { kind: 'h2', id: 'javascript', text: 'Pick JavaScript if...' },
      {
        kind: 'list',
        items: [
          'You want to build websites and see your work in the browser.',
          'You plan to become a frontend or full stack developer.',
          'You like visual feedback: buttons, colours, animations.',
        ],
      },
      {
        kind: 'code',
        language: 'javascript',
        code: 'const names = ["Ali", "Sara", "Zain"];\nfor (const name of names) {\n  console.log(`Salam, ${name}!`);\n}',
      },
      { kind: 'h2', id: 'decide', text: 'Still unsure?' },
      {
        kind: 'p',
        text: 'Start with Python. It lets you focus on thinking like a programmer instead of fighting punctuation. When you move to JavaScript later, you will be surprised how much you already know.',
      },
    ],
  },
  {
    slug: 'read-error-messages',
    title: 'Stop Fearing Error Messages: How to Read Them',
    excerpt:
      'A red error is not a failure, it is the computer telling you exactly where to look. Learn to read tracebacks in three steps.',
    category: 'Coding for beginners',
    author: 'Coddify Team',
    date: '2026-10-14',
    readMinutes: 5,
    cover: { color: '#b91c1c', icon: 'alert-circle' },
    body: [
      {
        kind: 'p',
        text: 'Beginners often see an error and start changing random lines. Experienced developers do the opposite: they slow down and **read the message**. Most errors tell you the file, the line and the reason.',
      },
      {
        kind: 'code',
        language: 'text',
        code: 'Traceback (most recent call last):\n  File "main.py", line 3, in <module>\n    print(totl)\nNameError: name \'totl\' is not defined',
      },
      { kind: 'h2', id: 'last-line', text: 'Step 1: read the last line first' },
      {
        kind: 'p',
        text: 'The last line names the error type and the reason. Here it is a `NameError`: Python does not know anything called `totl`.',
      },
      { kind: 'h2', id: 'line-number', text: 'Step 2: find the line number' },
      {
        kind: 'p',
        text: 'Go to line 3. The problem is often right there, or one line above it, like a missing bracket that only breaks the next line.',
      },
      { kind: 'h2', id: 'common-errors', text: 'Step 3: recognise the usual suspects' },
      {
        kind: 'list',
        items: [
          '`NameError`: a typo in a name, or a variable used before it gets a value.',
          '`SyntaxError`: a missing quote, colon or bracket.',
          '`TypeError`: mixing types, like adding text to a number.',
          '`IndexError`: asking for an item past the end of a list.',
        ],
      },
      {
        kind: 'tip',
        text: 'Stuck in a Coddify lesson? Ask Bit "why is this error happening?" It reads your last run and explains the error without giving away the answer.',
      },
    ],
  },
  {
    slug: 'meet-bit-ai-tutor',
    title: 'Meet Bit: Why Our AI Tutor Gives Hints, Not Answers',
    excerpt:
      'Copying an answer feels like progress but teaches nothing. Here is how Bit, the Coddify tutor, is designed to keep you thinking.',
    category: 'Artificial intelligence',
    author: 'Coddify Team',
    date: '2026-10-07',
    readMinutes: 4,
    cover: { color: '#6d28d9', icon: 'sparkles' },
    body: [
      {
        kind: 'p',
        text: 'Every Coddify lesson and practice problem has Bit, our AI tutor, docked next to the editor. Bit can see the exercise, your code and the result of your last run. What it will not do is write the solution for you.',
      },
      { kind: 'h2', id: 'why-hints', text: 'Why hints work better' },
      {
        kind: 'p',
        text: 'The moment you figure something out yourself is the moment you actually learn it. A full answer skips that moment. So Bit explains what an error means, asks a guiding question or points at the line to look at, and leaves the last step to you.',
      },
      { kind: 'h2', id: 'what-to-ask', text: 'Good things to ask Bit' },
      {
        kind: 'list',
        items: [
          '"Explain this challenge to me in simpler words."',
          '"Why is my output different from the expected one?"',
          '"What does this error mean?"',
          '"Give me a small hint for the next step."',
        ],
      },
      { kind: 'h2', id: 'limits', text: 'What Bit is not' },
      {
        kind: 'p',
        text: 'Bit is an AI model and it can make mistakes, so always run your code to check. It also only talks about programming; ask it about cricket scores and it will kindly steer you back to your loop.',
      },
    ],
  },
  {
    slug: 'big-o-in-plain-words',
    title: 'Big O Notation in Plain Words',
    excerpt:
      'Big O sounds scary in interviews, but it is just a way to describe how code slows down as the input grows. Explained with everyday examples.',
    category: 'Data structures & algorithms',
    author: 'Coddify Team',
    date: '2026-09-30',
    readMinutes: 8,
    cover: { color: '#0e7490', icon: 'bar-chart' },
    body: [
      {
        kind: 'p',
        text: 'Big O answers one question: **if the input gets ten times bigger, how much slower does my code get?** It ignores small details and focuses on the growth.',
      },
      { kind: 'h2', id: 'constant', text: 'O(1): constant time' },
      {
        kind: 'p',
        text: 'Reading the first item of a list takes the same time whether the list has 10 items or 10 million. Like opening the first page of any book.',
      },
      { kind: 'h2', id: 'linear', text: 'O(n): linear time' },
      {
        kind: 'p',
        text: 'Checking every item once, like looking for a name in an unsorted attendance sheet. Double the sheet, double the work.',
      },
      {
        kind: 'code',
        language: 'python',
        code: 'def contains(items, target):\n    for item in items:      # runs n times\n        if item == target:\n            return True\n    return False',
      },
      { kind: 'h2', id: 'quadratic', text: 'O(n²): quadratic time' },
      {
        kind: 'p',
        text: 'A loop inside a loop over the same data, like comparing every student with every other student. Ten times the input means about a hundred times the work, which is why interviewers ask you to improve it.',
      },
      { kind: 'h2', id: 'logarithmic', text: 'O(log n): logarithmic time' },
      {
        kind: 'p',
        text: 'Halving the problem each step, like finding a word in a dictionary by opening the middle. Even a million items take only about 20 steps.',
      },
      {
        kind: 'tip',
        text: 'In an interview, say the Big O of your first solution out loud, then ask yourself: can a set or a dictionary remove one of my loops?',
      },
    ],
  },
  {
    slug: 'first-software-internship',
    title: 'Landing Your First Software Internship in Pakistan',
    excerpt:
      'No experience, no network? You can still stand out. A practical checklist for students applying to their first internship.',
    category: 'Careers',
    author: 'Coddify Team',
    date: '2026-09-22',
    readMinutes: 9,
    cover: { color: '#c2410c', icon: 'briefcase' },
    body: [
      {
        kind: 'p',
        text: 'Your first internship is the hardest to get, because every posting seems to want experience you do not have yet. The good news: for interns, companies mostly look for **proof that you can learn and finish things**.',
      },
      { kind: 'h2', id: 'projects', text: 'Build two projects you can explain' },
      {
        kind: 'p',
        text: 'Two small finished projects beat ten half-done tutorials. Pick problems you understand, like a hostel mess menu app or a tool for your society, and be ready to explain every decision.',
      },
      { kind: 'h2', id: 'github', text: 'Make your GitHub readable' },
      {
        kind: 'list',
        items: [
          'Pin your best two or three repositories.',
          'Write a README with a screenshot, what it does and how to run it.',
          'Commit small and often, with clear messages.',
        ],
      },
      { kind: 'h2', id: 'cv', text: 'Keep the CV to one page' },
      {
        kind: 'p',
        text: 'Lead with projects and skills, then education. Link your GitHub, LinkedIn and any Coddify certificates. Remove anything you cannot talk about for two minutes.',
      },
      { kind: 'h2', id: 'practice', text: 'Practise the technical round' },
      {
        kind: 'p',
        text: 'Most intern interviews include easy coding problems: strings, arrays, loops and dictionaries. Solving a few problems every week in Coddify Interview prep, out loud, is the best preparation.',
      },
      {
        kind: 'tip',
        text: 'Apply early and widely. Software houses, startups and university incubators all hire interns, and many roles are never posted publicly, so ask seniors and teachers too.',
      },
    ],
  },
  {
    slug: 'coding-terms-for-beginners',
    title: '20 Coding Terms Every Beginner Should Know',
    excerpt:
      'Variable, function, loop, bug, API... A plain-language glossary of the words you will hear in your first month of coding.',
    category: 'Coding for beginners',
    author: 'Coddify Team',
    date: '2026-09-15',
    readMinutes: 10,
    cover: { color: '#4338ca', icon: 'book' },
    body: [
      {
        kind: 'p',
        text: 'Programmers use a lot of jargon. Here are the terms you will meet first, each in one sentence.',
      },
      { kind: 'h2', id: 'basics', text: 'The basics' },
      {
        kind: 'list',
        items: [
          '**Variable**: a name that stores a value, like `score = 10`.',
          '**Data type**: the kind of value: text (string), whole number (integer), true/false (boolean).',
          '**Function**: a named block of code you can run again and again.',
          '**Argument**: a value you pass into a function.',
          '**Return value**: what a function gives back.',
          '**Loop**: code that repeats, like `for` and `while`.',
          '**Condition**: a check that decides which code runs, like `if`.',
          '**List / array**: an ordered collection of values.',
          '**Dictionary / object**: values stored by name (key).',
          '**String**: text inside quotes.',
        ],
      },
      { kind: 'h2', id: 'working', text: 'Words from everyday work' },
      {
        kind: 'list',
        items: [
          '**Bug**: a mistake that makes code behave wrongly.',
          '**Debugging**: finding and fixing bugs.',
          '**Syntax**: the grammar rules of a language.',
          '**Compiler / interpreter**: the program that turns your code into something the computer runs.',
          '**Library**: code written by others that you can reuse.',
          '**API**: a set of rules that lets two programs talk to each other.',
          '**Frontend / backend**: what users see, and the server work behind it.',
          '**Database**: where an app stores its data.',
          '**Git**: a tool that tracks changes to your code.',
          '**Deploy**: putting your app online for others to use.',
        ],
      },
    ],
  },
  {
    slug: 'why-coddify-is-free',
    title: 'Why Coddify Is Free (and Will Stay Free)',
    excerpt:
      'No subscriptions, no energy bars, no paid boosts. Why we built Coddify this way, and what we unlock with progress instead.',
    category: 'Inside Coddify',
    author: 'Coddify Team',
    date: '2026-09-08',
    readMinutes: 4,
    cover: { color: '#15803d', icon: 'gift' },
    body: [
      {
        kind: 'p',
        text: 'Many learning apps limit how much you can learn per day unless you pay. We think that is backwards. When you are motivated, nothing should stop you from doing one more lesson.',
      },
      { kind: 'h2', id: 'no-paywalls', text: 'No paywalls, no energy' },
      {
        kind: 'p',
        text: 'Every course, practice problem, interview question and the AI tutor are available to every learner. There is no "hearts" or "energy" system that ends your session.',
      },
      { kind: 'h2', id: 'unlocks', text: 'Progress is the currency' },
      {
        kind: 'p',
        text: 'The store still exists, but you unlock items by learning: editor themes, new tutor robots, profile frames, titles and name effects. Finish lessons, keep streaks and climb leagues, and the rewards follow.',
      },
      {
        kind: 'tip',
        text: 'Check the Store tab to see exactly what each item needs, like "Reach level 5" or "Keep a 30-day streak".',
      },
    ],
  },
  {
    slug: 'streaks-and-leagues',
    title: 'How Streaks and Leagues Keep You Learning',
    excerpt:
      'A look at the game ideas inside Coddify: XP, daily streaks, missions and weekly leagues, and how to use them without stress.',
    category: 'Inside Coddify',
    author: 'Coddify Team',
    date: '2026-08-30',
    readMinutes: 5,
    cover: { color: '#a16207', icon: 'trophy' },
    body: [
      {
        kind: 'p',
        text: 'Coddify borrows ideas from games because they work: clear goals, quick feedback and a little friendly competition.',
      },
      { kind: 'h2', id: 'xp', text: 'XP and levels' },
      {
        kind: 'p',
        text: 'Every lesson, challenge and mission gives you XP. XP fills your level bar, and new levels unlock store items and badges.',
      },
      { kind: 'h2', id: 'streak', text: 'Daily streak' },
      {
        kind: 'p',
        text: 'Hit your daily goal and your streak grows by one. The streak page shows your calendar so you can see the habit forming.',
      },
      { kind: 'h2', id: 'leagues', text: 'Weekly leagues' },
      {
        kind: 'p',
        text: 'Each week you are placed in a small league with learners at a similar pace. Earn XP to move up; finish near the bottom and you drop down. It resets every Monday, so every week is a fresh start.',
      },
      {
        kind: 'tip',
        text: 'Use the game, do not let it use you. If a league week feels stressful, ignore it and focus on your streak.',
      },
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
