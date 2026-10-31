/** DTOs shared by the HTTP and mock learning APIs. Field names match the backend's camelCase JSON. */
import { TechId } from '../../shared/data/tech';

export type JourneyNodeKind = 'lesson' | 'quiz' | 'practice' | 'chest';
export type JourneyNodeState = 'completed' | 'current' | 'locked';

export interface JourneyNode {
  readonly id: string;
  readonly title: string;
  readonly kind: JourneyNodeKind;
  readonly state: JourneyNodeState;
  readonly xp: number;
}

export interface JourneyChapter {
  readonly id: string;
  /** 1-based number inside its section. */
  readonly number: number;
  readonly title: string;
  readonly nodes: readonly JourneyNode[];
}

export interface Journey {
  readonly courseId: TechId;
  readonly courseName: string;
  readonly sectionNumber: number;
  readonly sectionTitle: string;
  readonly chapters: readonly JourneyChapter[];
}

export type SectionState = 'in-progress' | 'completed' | 'available' | 'locked';

/** One section of a course syllabus ("Section 1 · Fundamentals"). */
export interface CourseSection {
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly lessonCount: number;
  readonly completedCount: number;
  readonly state: SectionState;
}

/** A short standalone course listed under "More courses in Python". */
export interface MiniCourse {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly lessonCount: number;
  readonly certificate: boolean;
  readonly tags: readonly string[];
}

export interface CourseSyllabus {
  readonly courseId: TechId;
  readonly courseName: string;
  readonly enrolled: boolean;
  readonly sections: readonly CourseSection[];
  readonly moreCourses: readonly MiniCourse[];
}

/** A course the learner has started, for the "My journeys" list. */
export interface EnrolledCourse {
  readonly courseId: TechId;
  readonly courseName: string;
  readonly sectionNumber: number;
  readonly sectionCount: number;
  readonly sectionTitle: string;
  /** 0..100 through the current section. */
  readonly percent: number;
  readonly active: boolean;
}

/** Rich text of a lesson, kept as simple blocks so the backend can store it as JSON. */
export type LessonBlock =
  | { readonly type: 'paragraph'; readonly text: string }
  | { readonly type: 'code'; readonly code: string }
  | { readonly type: 'tip'; readonly text: string };

export interface TestCase {
  readonly id: string;
  readonly label: string;
  /** null: any output passes as long as the code runs without errors. */
  readonly expectedOutput: string | null;
}

export type ChallengeLevel = 'Beginner' | 'Easy' | 'Medium' | 'Hard';

export interface LessonChallenge {
  readonly level: ChallengeLevel;
  readonly intro: string;
  readonly steps: readonly string[];
  readonly starterCode: string;
  readonly solution: string;
  readonly tests: readonly TestCase[];
}

export interface ReferenceEntry {
  readonly title: string;
  readonly body: string;
  readonly code?: string;
}

export interface Lesson {
  readonly id: string;
  readonly courseId: TechId;
  readonly chapterTitle: string;
  readonly title: string;
  /** Monaco language id, e.g. "python" or "javascript". */
  readonly editorLanguage: string;
  readonly fileName: string;
  readonly summary: string;
  readonly content: readonly LessonBlock[];
  readonly challenge: LessonChallenge;
  readonly reference: readonly ReferenceEntry[];
  readonly xp: number;
  readonly nextLessonId: string | null;
}

export interface TestResult {
  readonly testId: string;
  readonly passed: boolean;
}

export interface RunResult {
  readonly output: string;
  readonly error: string | null;
  readonly tests: readonly TestResult[];
  readonly passed: boolean;
}

export interface LessonReward {
  readonly xpEarned: number;
  readonly gemsEarned: number;
  readonly firstTry: boolean;
  readonly streakIncreased: boolean;
  readonly streak: number;
}

export interface Submission {
  readonly id: string;
  readonly submittedAt: string;
  readonly passed: boolean;
  readonly code: string;
}
