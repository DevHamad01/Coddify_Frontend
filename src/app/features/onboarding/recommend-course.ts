import { CompleteOnboardingAnswers, Experience } from '../../core/onboarding/onboarding.models';
import { Language, LanguageId, findLanguage } from '../../shared/data/languages';

export interface CourseReason {
  readonly title: string;
  readonly detail: string;
}

export interface CourseRecommendation {
  readonly language: Language;
  readonly courseTitle: string;
  readonly reasons: readonly CourseReason[];
  /** Rough time to finish the course at the chosen daily target. */
  readonly estimatedWeeks: number;
}

/** Approximate length of a starter course, in minutes of active learning. */
const COURSE_MINUTES = 600;

const LEVEL_TITLE: Record<Experience, string> = {
  beginner: 'Foundations',
  some: 'Essentials',
  comfortable: 'Problem Solving',
};

const REASONS: Record<LanguageId, readonly CourseReason[]> = {
  python: [
    { title: 'Beginner friendly', detail: 'Clean syntax that reads almost like English' },
    { title: 'Useful everywhere', detail: 'Automation, data, AI and backend work' },
    { title: 'Quick first wins', detail: 'Real programs in your first week' },
  ],
  javascript: [
    { title: 'Built for the web', detail: 'Every website and web app runs it' },
    { title: 'Great for freelancing', detail: 'The most requested skill on client projects' },
    { title: 'See results instantly', detail: 'Your code runs right in the browser' },
  ],
  cpp: [
    { title: 'University favourite', detail: 'Matches most Programming Fundamentals courses' },
    { title: 'Understand the machine', detail: 'Memory, speed and how computers really work' },
    { title: 'Strong for DSA', detail: 'The go-to language for competitive programming' },
  ],
  java: [
    { title: 'Industry standard', detail: 'Used by banks, telcos and large software houses' },
    { title: 'OOP done properly', detail: 'Classes and design patterns interviewers ask about' },
    { title: 'Android ready', detail: 'A direct path into mobile development' },
  ],
  csharp: [
    { title: 'Modern and typed', detail: 'Clear errors that help you learn faster' },
    { title: 'Full-stack with .NET', detail: 'APIs, web apps and desktop tools' },
    { title: 'Game development', detail: 'The language behind many popular game engines' },
  ],
};

/**
 * Picks a starter course. An explicit language choice always wins; otherwise:
 * freelancing → JavaScript (web work), complete beginners → Python,
 * university → C++, job → Java, and anything else → Python.
 */
export function recommendCourse(answers: CompleteOnboardingAnswers): CourseRecommendation {
  const id = pickLanguage(answers);
  const language = findLanguage(id);
  return {
    language,
    courseTitle: `${language.name} ${LEVEL_TITLE[answers.experience]}`,
    reasons: REASONS[id],
    estimatedWeeks: Math.ceil(COURSE_MINUTES / (answers.dailyMinutes * 7)),
  };
}

function pickLanguage({ language, goal, experience }: CompleteOnboardingAnswers): LanguageId {
  if (language !== 'unsure') {
    return language;
  }
  if (goal === 'freelancing') {
    return 'javascript';
  }
  if (experience === 'beginner') {
    return 'python';
  }
  if (goal === 'university') {
    return 'cpp';
  }
  return goal === 'job' ? 'java' : 'python';
}
