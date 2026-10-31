import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { Submission } from '../../learning/learning.models';
import { ProblemSubmission } from '../../practice/practice.models';
import { TechId } from '../../../shared/data/tech';
import { isoDate } from '../../gamification/streak-calendar';

/**
 * Learner progress used by the mock learning, gamification and practice APIs.
 * One record per browser (mirrored to localStorage) so a demo survives a refresh.
 */
export interface MockProgressState {
  completedNodes: string[];
  claimedChests: string[];
  totalXp: number;
  gems: number;
  streak: number;
  /** yyyy-mm-dd of the last day with a completed activity. */
  lastActiveDay: string | null;
  dailyGoal: number | null;
  activitiesToday: number;
  xpToday: number;
  perfectToday: boolean;
  activityDay: string | null;
  /** Equipped item id per store slot (title, frame, theme, tutor…). */
  equipped: Record<string, string>;
  submissions: Record<string, Submission[]>;
  solvedProblems: string[];
  interviewDate: string | null;
  likedQuote: boolean;
  /** Course the journey screen shows; the rest of enrolledCourses are one click away. */
  activeCourse: TechId;
  enrolledCourses: TechId[];
  /** yyyy-mm-dd of every day with at least one completed activity (streak calendar). */
  activeDays: string[];
  longestStreak: number;
  problemSubmissions: Record<string, ProblemSubmission[]>;
}

const STORAGE_KEY = 'coddify.mock-progress';

const FRESH: MockProgressState = {
  completedNodes: [],
  claimedChests: [],
  totalXp: 0,
  gems: 0,
  streak: 0,
  lastActiveDay: null,
  dailyGoal: null,
  activitiesToday: 0,
  xpToday: 0,
  perfectToday: false,
  activityDay: null,
  equipped: {},
  submissions: {},
  solvedProblems: [],
  interviewDate: null,
  likedQuote: false,
  activeCourse: 'python',
  enrolledCourses: ['python'],
  activeDays: [],
  longestStreak: 0,
  problemSubmissions: {},
};

/** Local yyyy-mm-dd, so "today" flips at the learner's midnight, not UTC's. */
export function today(): string {
  return isoDate(new Date());
}

@Injectable({ providedIn: 'root' })
export class MockProgress {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private state: MockProgressState = this.load();

  /** Current state with "today" counters reset if the day changed. */
  get(): Readonly<MockProgressState> {
    if (this.state.activityDay !== today()) {
      this.state = {
        ...this.state,
        activitiesToday: 0,
        xpToday: 0,
        perfectToday: false,
        activityDay: today(),
      };
    }
    return this.state;
  }

  update(changes: Partial<MockProgressState>): Readonly<MockProgressState> {
    this.state = { ...this.get(), ...changes };
    this.save();
    return this.state;
  }

  private load(): MockProgressState {
    if (!this.isBrowser) {
      return structuredClone(FRESH);
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? { ...structuredClone(FRESH), ...(JSON.parse(raw) as MockProgressState) }
        : structuredClone(FRESH);
    } catch {
      return structuredClone(FRESH);
    }
  }

  private save(): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage full or blocked: keep working in memory.
    }
  }
}
