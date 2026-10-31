/** DTOs shared by the HTTP and mock practice APIs. Field names match the backend's camelCase JSON. */

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
