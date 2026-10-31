import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TechId, findTech } from '../../shared/data/tech';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApiError } from '../api/api-error';
import { MockDb } from '../api/mock/mock-db';
import { MockProgress, today } from '../api/mock/mock-progress';
import { APP_ENV } from '../config/environment';
import {
  Journey,
  JourneyNode,
  Lesson,
  LessonReward,
  RunResult,
  Submission,
} from './learning.models';
import { runSnippet } from './mock/mini-runner';
import { PYTHON_CHAPTERS, PYTHON_LESSONS, PYTHON_SECTION } from './mock/python-course.mock';

/** Learning backend contract (journey map, lessons, code runs); bound in `provideApis()`. */
export abstract class LearningApi {
  abstract getJourney(courseId: TechId): Observable<Journey>;
  abstract getLesson(lessonId: string): Observable<Lesson>;
  abstract run(lessonId: string, code: string): Observable<RunResult>;
  /** Marks a passed lesson complete and returns the reward. Repeat completions earn nothing. */
  abstract complete(lessonId: string, code: string, firstTry: boolean): Observable<LessonReward>;
  abstract getSubmissions(lessonId: string): Observable<readonly Submission[]>;
  abstract claimChest(nodeId: string): Observable<{ readonly gems: number }>;
}

@Injectable({ providedIn: 'root' })
export class HttpLearningApi extends LearningApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;
  private readonly urls = API_ENDPOINTS.learning;

  getJourney(courseId: TechId): Observable<Journey> {
    return this.http.get<Journey>(this.baseUrl + this.urls.journey(courseId));
  }

  getLesson(lessonId: string): Observable<Lesson> {
    return this.http.get<Lesson>(this.baseUrl + this.urls.lesson(lessonId));
  }

  run(lessonId: string, code: string): Observable<RunResult> {
    return this.http.post<RunResult>(this.baseUrl + this.urls.run(lessonId), { code });
  }

  complete(lessonId: string, code: string, firstTry: boolean): Observable<LessonReward> {
    return this.http.post<LessonReward>(this.baseUrl + this.urls.complete(lessonId), {
      code,
      firstTry,
    });
  }

  getSubmissions(lessonId: string): Observable<readonly Submission[]> {
    return this.http.get<Submission[]>(this.baseUrl + this.urls.submissions(lessonId));
  }

  claimChest(nodeId: string): Observable<{ readonly gems: number }> {
    return this.http.post<{ gems: number }>(this.baseUrl + this.urls.claimChest(nodeId), {});
  }
}

const CHEST_GEMS = 5;
const LESSON_GEMS = 2;

@Injectable({ providedIn: 'root' })
export class MockLearningApi extends LearningApi {
  private readonly db = inject(MockDb);
  private readonly progress = inject(MockProgress);

  getJourney(courseId: TechId): Observable<Journey> {
    return this.db.respond(() => {
      const done = new Set([
        ...this.progress.get().completedNodes,
        ...this.progress.get().claimedChests,
      ]);
      let currentAssigned = false;
      const chapters = PYTHON_CHAPTERS.map((chapter, index) => ({
        id: chapter.id,
        number: index + 1,
        title: chapter.title,
        nodes: chapter.nodes.map<JourneyNode>((node) => {
          let state: JourneyNode['state'] = 'locked';
          if (done.has(node.id)) {
            state = 'completed';
          } else if (!currentAssigned) {
            state = 'current';
            currentAssigned = true;
          }
          return { ...node, state };
        }),
      }));
      // Only Python has mock content; other courses reuse it under their own name.
      return {
        courseId,
        courseName: findTech(courseId).name,
        sectionNumber: PYTHON_SECTION.number,
        sectionTitle: PYTHON_SECTION.title,
        chapters,
      };
    });
  }

  getLesson(lessonId: string): Observable<Lesson> {
    return this.db.respond(() => this.findLesson(lessonId));
  }

  run(lessonId: string, code: string): Observable<RunResult> {
    return this.db.respond(() => {
      const lesson = this.findLesson(lessonId);
      const { output, error } = runSnippet(code, lesson.editorLanguage);
      const normalise = (text: string) =>
        text
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
          .trim();
      const tests = lesson.challenge.tests.map((test) => ({
        testId: test.id,
        passed:
          !error &&
          (test.expectedOutput === null || normalise(output) === normalise(test.expectedOutput)),
      }));
      return { output, error, tests, passed: tests.every((test) => test.passed) };
    });
  }

  complete(lessonId: string, code: string, firstTry: boolean): Observable<LessonReward> {
    return this.db.respond(() => {
      const lesson = this.findLesson(lessonId);
      const state = this.progress.get();
      const submission: Submission = {
        id: `s-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        passed: true,
        code,
      };
      const submissions = {
        ...state.submissions,
        [lessonId]: [submission, ...(state.submissions[lessonId] ?? [])],
      };
      if (state.completedNodes.includes(lessonId)) {
        this.progress.update({ submissions });
        return {
          xpEarned: 0,
          gemsEarned: 0,
          firstTry,
          streakIncreased: false,
          streak: state.streak,
        };
      }

      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      const streakIncreased = state.lastActiveDay !== today();
      const streak = !streakIncreased
        ? state.streak
        : state.lastActiveDay === yesterday
          ? state.streak + 1
          : 1;
      this.progress.update({
        submissions,
        completedNodes: [...state.completedNodes, lessonId],
        totalXp: state.totalXp + lesson.xp,
        gems: state.gems + LESSON_GEMS,
        streak,
        lastActiveDay: today(),
        activitiesToday: state.activitiesToday + 1,
        xpToday: state.xpToday + lesson.xp,
        perfectToday: state.perfectToday || firstTry,
      });
      return { xpEarned: lesson.xp, gemsEarned: LESSON_GEMS, firstTry, streakIncreased, streak };
    });
  }

  getSubmissions(lessonId: string): Observable<readonly Submission[]> {
    return this.db.respond(() => this.progress.get().submissions[lessonId] ?? []);
  }

  claimChest(nodeId: string): Observable<{ readonly gems: number }> {
    return this.db.respond(() => {
      const state = this.progress.get();
      if (state.claimedChests.includes(nodeId)) {
        return { gems: 0 };
      }
      this.progress.update({
        claimedChests: [...state.claimedChests, nodeId],
        gems: state.gems + CHEST_GEMS,
      });
      return { gems: CHEST_GEMS };
    });
  }

  private findLesson(lessonId: string): Lesson {
    const lesson = PYTHON_LESSONS.get(lessonId);
    if (!lesson) {
      throw new ApiError('not_found', 'That lesson does not exist.', 404);
    }
    return lesson;
  }
}
