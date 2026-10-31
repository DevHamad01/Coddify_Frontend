/** DTOs shared by the HTTP and mock practice APIs. Field names match the backend's camelCase JSON. */
import { TechId } from '../../shared/data/tech';

export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'solved' | 'in-progress' | 'todo';

export const DIFFICULTIES: readonly Difficulty[] = ['Beginner', 'Easy', 'Medium', 'Hard'];

export interface InterviewProblem {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly topic: string;
  readonly difficulty: Difficulty;
  readonly status: ProblemStatus;
}

export interface InterviewSet {
  readonly title: string;
  readonly topic: string;
  readonly difficulty: Difficulty;
  readonly problems: readonly (InterviewProblem & { readonly surprise?: boolean })[];
}

export type ProblemSort = 'number' | 'title' | 'topic' | 'difficulty';

export interface ProblemQuery {
  readonly search: string;
  readonly topic: string | null;
  readonly difficulty: Difficulty | null;
  readonly status: ProblemStatus | null;
  readonly sort: ProblemSort;
  readonly direction: 'asc' | 'desc';
  /** 1-based. */
  readonly page: number;
  readonly pageSize: number;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface InterviewProgress {
  readonly solved: Readonly<Record<Difficulty, number>>;
  readonly interviewDate: string | null;
}

/** A free coding challenge from the challenge bank, written for one language. */
export interface Challenge {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly language: TechId;
  readonly difficulty: Difficulty;
  readonly status: ProblemStatus;
}

export interface ChallengeQuery {
  /** Empty = every language. */
  readonly languages: readonly TechId[];
  readonly difficulties: readonly Difficulty[];
  readonly page: number;
  readonly pageSize: number;
}

/** Languages the problem workspace can open (Monaco ids). */
export type WorkspaceLanguage = 'python' | 'javascript' | 'java' | 'cpp';

export interface ProblemParam {
  readonly name: string;
  readonly type: string;
  readonly description: string;
}

export interface ProblemExample {
  readonly input: string;
  readonly output: string;
  readonly explanation?: string;
}

export interface ProblemTest {
  readonly id: string;
  /** Arguments as shown to the learner, e.g. `"Coddy2026"`. */
  readonly args: string;
  readonly expected: string;
}

export interface SolutionApproach {
  readonly title: string;
  readonly time: string;
  readonly space: string;
  readonly best?: boolean;
}

export interface ProblemSolution {
  readonly summary: string;
  readonly approaches: readonly SolutionApproach[];
  readonly intuition: readonly string[];
  readonly steps: readonly string[];
  readonly code: Readonly<Partial<Record<WorkspaceLanguage, string>>>;
  readonly pitfalls: readonly string[];
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
}

export interface SimilarProblem {
  readonly id: string;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly topic: string;
}

/** Everything the problem workspace shows for one interview problem or challenge. */
export interface ProblemDetail {
  readonly id: string;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly topics: readonly string[];
  /** Paragraphs; `inline code` and **bold** are rendered by the rich-text component. */
  readonly statement: readonly string[];
  readonly functionName: string;
  readonly params: readonly ProblemParam[];
  readonly returns: { readonly type: string; readonly description: string };
  readonly constraints: readonly string[];
  readonly examples: readonly ProblemExample[];
  readonly hints: readonly string[];
  readonly solution: ProblemSolution;
  readonly similar: readonly SimilarProblem[];
  readonly languages: readonly WorkspaceLanguage[];
  readonly defaultLanguage: WorkspaceLanguage;
  readonly starterCode: Readonly<Record<WorkspaceLanguage, string>>;
  readonly tests: readonly ProblemTest[];
  readonly status: ProblemStatus;
}

export interface ProblemTestResult {
  readonly testId: string;
  readonly output: string;
  readonly passed: boolean;
}

export interface ProblemRunResult {
  readonly results: readonly ProblemTestResult[];
  readonly passed: boolean;
  readonly error: string | null;
}

export interface ProblemSubmission {
  readonly id: string;
  readonly submittedAt: string;
  readonly language: WorkspaceLanguage;
  readonly passed: boolean;
  readonly code: string;
}
