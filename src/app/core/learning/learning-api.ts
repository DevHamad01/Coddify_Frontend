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
  CourseSection,
  CourseSyllabus,
  EnrolledCourse,
  Journey,
  JourneyNode,
  Lesson,
  LessonReward,
  RunResult,
  Submission,
} from './learning.models';
import { isoDate } from '../gamification/streak-calendar';
import { runSnippet } from './mock/mini-runner';
import {
  chaptersFor,
  courseOfNode,
  lessonFor,
  moreCoursesFor,
  playableNodeIds,
  sectionsFor,
} from './mock/course-catalog.mock';

/** Learning backend contract (journey map, lessons, code runs); bound in `provideApis()`. */
export abstract class LearningApi {
  abstract getJourney(courseId: TechId): Observable<Journey>;
  abstract getLesson(lessonId: string): Observable<Lesson>;
  abstract run(lessonId: string, code: string): Observable<RunResult>;
  /** Marks a passed lesson complete and returns the reward. Repeat completions earn nothing. */
  abstract complete(lessonId: string, code: string, firstTry: boolean): Observable<LessonReward>;
  abstract getSubmissions(lessonId: string): Observable<readonly Submission[]>;
  abstract claimChest(nodeId: string): Observable<{ readonly gems: number }>;
  /** Sections and side courses of one course, with the learner's progress. */
  abstract getSyllabus(courseId: TechId): Observable<CourseSyllabus>;
  /** Courses the learner has started, the active one first. */
  abstract getMyCourses(): Observable<readonly EnrolledCourse[]>;
  /** Enrols if needed and makes the course the one the journey screen shows. */
  abstract startCourse(courseId: TechId): Observable<readonly EnrolledCourse[]>;
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

  getSyllabus(courseId: TechId): Observable<CourseSyllabus> {
    return this.http.get<CourseSyllabus>(this.baseUrl + this.urls.syllabus(courseId));
  }

  getMyCourses(): Observable<readonly EnrolledCourse[]> {
    return this.http.get<EnrolledCourse[]>(this.baseUrl + this.urls.myCourses);
  }

  startCourse(courseId: TechId): Observable<readonly EnrolledCourse[]> {
    return this.http.post<EnrolledCourse[]>(this.baseUrl + this.urls.startCourse(courseId), {});
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
      const chapters = chaptersFor(courseId).map((chapter, index) => ({
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
      return {
        courseId,
        courseName: findTech(courseId).name,
        sectionNumber: 1,
        sectionTitle: sectionsFor(courseId)[0].title,
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
      const { output, error } = this.execute(code, lesson.editorLanguage);
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

      const yesterday = isoDate(new Date(Date.now() - 86_400_000));
      const streakIncreased = state.lastActiveDay !== today();
      const streak = !streakIncreased
        ? state.streak
        : state.lastActiveDay === yesterday
          ? state.streak + 1
          : 1;
      this.progress.update({
        submissions,
        activeDays: state.activeDays.includes(today())
          ? state.activeDays
          : [...state.activeDays, today()],
        longestStreak: Math.max(state.longestStreak, streak),
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

  getSyllabus(courseId: TechId): Observable<CourseSyllabus> {
    return this.db.respond(() => {
      const state = this.progress.get();
      const enrolled = state.enrolledCourses.includes(courseId);
      const done = this.completedIn(courseId);
      const sections = sectionsFor(courseId).map<CourseSection>((section, index) => {
        const completedCount = index === 0 ? done : 0;
        let sectionState: CourseSection['state'] = 'locked';
        if (index === 0) {
          sectionState = enrolled ? 'in-progress' : 'available';
        }
        return { number: index + 1, ...section, completedCount, state: sectionState };
      });
      return {
        courseId,
        courseName: findTech(courseId).name,
        enrolled,
        sections,
        moreCourses: moreCoursesFor(courseId),
      };
    });
  }

  getMyCourses(): Observable<readonly EnrolledCourse[]> {
    return this.db.respond(() => this.myCourses());
  }

  startCourse(courseId: TechId): Observable<readonly EnrolledCourse[]> {
    return this.db.respond(() => {
      const state = this.progress.get();
      this.progress.update({
        activeCourse: courseId,
        enrolledCourses: state.enrolledCourses.includes(courseId)
          ? state.enrolledCourses
          : [...state.enrolledCourses, courseId],
      });
      return this.myCourses();
    });
  }

  private myCourses(): EnrolledCourse[] {
    const state = this.progress.get();
    const ordered = [
      state.activeCourse,
      ...state.enrolledCourses.filter((id) => id !== state.activeCourse),
    ];
    return ordered.map((courseId) => {
      const sections = sectionsFor(courseId);
      return {
        courseId,
        courseName: findTech(courseId).name,
        sectionNumber: 1,
        sectionCount: sections.length,
        sectionTitle: sections[0].title,
        percent: Math.round((this.completedIn(courseId) / sections[0].lessonCount) * 100),
        active: courseId === state.activeCourse,
      };
    });
  }

  private completedIn(courseId: TechId): number {
    const playable = new Set(playableNodeIds(courseId));
    return this.progress
      .get()
      .completedNodes.filter((id) => courseOfNode(id) === courseId && playable.has(id)).length;
  }

  /** The mini runner understands Python and JavaScript; other languages just echo their strings. */
  private execute(code: string, language: string): { output: string; error: string | null } {
    if (['python', 'javascript', 'typescript'].includes(language)) {
      return runSnippet(code, language);
    }
    const strings = [...code.matchAll(/"([^"\\]*)"/g)].map((match) => match[1]);
    return { output: strings.join('\n'), error: null };
  }

  private findLesson(lessonId: string): Lesson {
    const lesson = lessonFor(lessonId);
    if (!lesson) {
      throw new ApiError('not_found', 'That lesson does not exist.', 404);
    }
    return lesson;
  }
}
