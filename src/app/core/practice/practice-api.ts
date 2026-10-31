import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { findTech } from '../../shared/data/tech';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApiError } from '../api/api-error';
import { MockDb } from '../api/mock/mock-db';
import { MockProgress, today } from '../api/mock/mock-progress';
import { APP_ENV } from '../config/environment';
import { CHALLENGES } from './mock/challenges.mock';
import { generatedDetail } from './mock/problem-details.mock';
import { PROBLEMS, TOPICS } from './mock/problems.mock';
import {
  Challenge,
  ChallengeQuery,
  DIFFICULTIES,
  InterviewProblem,
  InterviewProgress,
  InterviewSet,
  Page,
  ProblemDetail,
  ProblemQuery,
  ProblemRunResult,
  ProblemSubmission,
  SimilarProblem,
  WorkspaceLanguage,
} from './practice.models';

/** Interview-prep problem bank and progress; bound in `provideApis()`. */
export abstract class PracticeApi {
  abstract getProblems(query: ProblemQuery): Observable<Page<InterviewProblem>>;
  abstract getTopics(): Observable<readonly string[]>;
  abstract getTodaySet(): Observable<InterviewSet>;
  abstract getProgress(): Observable<InterviewProgress>;
  abstract setInterviewDate(date: string | null): Observable<InterviewProgress>;
  abstract getChallenges(query: ChallengeQuery): Observable<Page<Challenge>>;
  /** Interview problem (`p-…`) or challenge (`c-…`) with everything the workspace shows. */
  abstract getProblem(id: string): Observable<ProblemDetail>;
  /** Runs the code against the visible tests without recording anything. */
  abstract runProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult>;
  /** Runs, records a submission and marks the problem solved when every test passes. */
  abstract submitProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult>;
  abstract getProblemSubmissions(id: string): Observable<readonly ProblemSubmission[]>;
}

@Injectable({ providedIn: 'root' })
export class HttpPracticeApi extends PracticeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;
  private readonly urls = API_ENDPOINTS.practice;

  getProblems(query: ProblemQuery): Observable<Page<InterviewProblem>> {
    let params = new HttpParams()
      .set('search', query.search)
      .set('sort', query.sort)
      .set('direction', query.direction)
      .set('page', query.page)
      .set('pageSize', query.pageSize);
    if (query.topic) params = params.set('topic', query.topic);
    if (query.difficulty) params = params.set('difficulty', query.difficulty);
    if (query.status) params = params.set('status', query.status);
    return this.http.get<Page<InterviewProblem>>(this.baseUrl + this.urls.problems, { params });
  }

  getTopics(): Observable<readonly string[]> {
    return this.http.get<string[]>(`${this.baseUrl}${this.urls.problems}/topics`);
  }

  getTodaySet(): Observable<InterviewSet> {
    return this.http.get<InterviewSet>(this.baseUrl + this.urls.today);
  }

  getProgress(): Observable<InterviewProgress> {
    return this.http.get<InterviewProgress>(this.baseUrl + this.urls.progress);
  }

  setInterviewDate(date: string | null): Observable<InterviewProgress> {
    return this.http.put<InterviewProgress>(this.baseUrl + this.urls.interviewDate, { date });
  }

  getChallenges(query: ChallengeQuery): Observable<Page<Challenge>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    query.languages.forEach((language) => (params = params.append('language', language)));
    query.difficulties.forEach((level) => (params = params.append('difficulty', level)));
    return this.http.get<Page<Challenge>>(this.baseUrl + this.urls.challenges, { params });
  }

  getProblem(id: string): Observable<ProblemDetail> {
    return this.http.get<ProblemDetail>(this.baseUrl + this.urls.problem(id));
  }

  runProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult> {
    return this.http.post<ProblemRunResult>(this.baseUrl + this.urls.run(id), { language, code });
  }

  submitProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult> {
    return this.http.post<ProblemRunResult>(this.baseUrl + this.urls.submit(id), {
      language,
      code,
    });
  }

  getProblemSubmissions(id: string): Observable<readonly ProblemSubmission[]> {
    return this.http.get<ProblemSubmission[]>(this.baseUrl + this.urls.submissions(id));
  }
}

/** XP for solving a problem the first time. */
const SOLVE_XP = 20;

@Injectable({ providedIn: 'root' })
export class MockPracticeApi extends PracticeApi {
  private readonly db = inject(MockDb);
  private readonly progress = inject(MockProgress);

  getProblems(query: ProblemQuery): Observable<Page<InterviewProblem>> {
    return this.db.respond(() => {
      const search = query.search.trim().toLowerCase();
      const filtered = this.withStatus().filter(
        (problem) =>
          (!search ||
            problem.title.toLowerCase().includes(search) ||
            problem.topic.toLowerCase().includes(search) ||
            String(problem.number) === search) &&
          (!query.topic || problem.topic === query.topic) &&
          (!query.difficulty || problem.difficulty === query.difficulty) &&
          (!query.status || problem.status === query.status),
      );
      const sign = query.direction === 'asc' ? 1 : -1;
      const sorted = [...filtered].sort((a, b) => {
        switch (query.sort) {
          case 'title':
            return sign * a.title.localeCompare(b.title);
          case 'topic':
            return sign * a.topic.localeCompare(b.topic) || a.number - b.number;
          case 'difficulty':
            return (
              sign * (DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty)) ||
              a.number - b.number
            );
          default:
            return sign * (a.number - b.number);
        }
      });
      const start = (query.page - 1) * query.pageSize;
      return {
        items: sorted.slice(start, start + query.pageSize),
        total: sorted.length,
        page: query.page,
        pageSize: query.pageSize,
      };
    });
  }

  getTopics(): Observable<readonly string[]> {
    return this.db.respond(() => TOPICS);
  }

  getTodaySet(): Observable<InterviewSet> {
    return this.db.respond(() => {
      const [first, second, third] = this.withStatus();
      return {
        title: first.title,
        topic: first.topic,
        difficulty: first.difficulty,
        problems: [first, second, { ...third, surprise: true }],
      };
    });
  }

  getProgress(): Observable<InterviewProgress> {
    return this.db.respond(() => this.summary());
  }

  setInterviewDate(date: string | null): Observable<InterviewProgress> {
    return this.db.respond(() => {
      this.progress.update({ interviewDate: date });
      return this.summary();
    });
  }


  getChallenges(query: ChallengeQuery): Observable<Page<Challenge>> {
    return this.db.respond(() => {
      const solved = new Set(this.progress.get().solvedProblems);
      const filtered = CHALLENGES.filter(
        (challenge) =>
          (!query.languages.length || query.languages.includes(challenge.language)) &&
          (!query.difficulties.length || query.difficulties.includes(challenge.difficulty)),
      ).map<Challenge>((challenge) => ({
        ...challenge,
        status: solved.has(challenge.id) ? 'solved' : 'todo',
      }));
      const start = (query.page - 1) * query.pageSize;
      return {
        items: filtered.slice(start, start + query.pageSize),
        total: filtered.length,
        page: query.page,
        pageSize: query.pageSize,
      };
    });
  }

  getProblem(id: string): Observable<ProblemDetail> {
    return this.db.respond(() => this.detail(id));
  }

  runProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult> {
    return this.db.respond(() => this.judge(this.detail(id), language, code));
  }

  submitProblem(
    id: string,
    language: WorkspaceLanguage,
    code: string,
  ): Observable<ProblemRunResult> {
    return this.db.respond(() => {
      const result = this.judge(this.detail(id), language, code);
      const state = this.progress.get();
      const submission: ProblemSubmission = {
        id: `ps-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        language,
        passed: result.passed,
        code,
      };
      const firstSolve = result.passed && !state.solvedProblems.includes(id);
      this.progress.update({
        problemSubmissions: {
          ...state.problemSubmissions,
          [id]: [submission, ...(state.problemSubmissions[id] ?? [])],
        },
        ...(firstSolve && {
          solvedProblems: [...state.solvedProblems, id],
          totalXp: state.totalXp + SOLVE_XP,
          xpToday: state.xpToday + SOLVE_XP,
          activitiesToday: state.activitiesToday + 1,
          lastActiveDay: today(),
          activeDays: state.activeDays.includes(today())
            ? state.activeDays
            : [...state.activeDays, today()],
        }),
      });
      return result;
    });
  }

  getProblemSubmissions(id: string): Observable<readonly ProblemSubmission[]> {
    return this.db.respond(() => this.progress.get().problemSubmissions[id] ?? []);
  }

  private detail(id: string): ProblemDetail {
    const solved = this.progress.get().solvedProblems.includes(id);
    const status = solved ? ('solved' as const) : ('todo' as const);
    const problem = PROBLEMS.find((item) => item.id === id);
    if (problem) {
      const similar: SimilarProblem[] = PROBLEMS.filter(
        (item) => item.topic === problem.topic && item.id !== id,
      )
        .slice(0, 3)
        .map(({ id: similarId, title, difficulty, topic }) => ({
          id: similarId,
          title,
          difficulty,
          topic,
        }));
      return { id, status, similar, ...generatedDetail(problem) };
    }
    const challenge = CHALLENGES.find((item) => item.id === id);
    if (challenge) {
      const topic = `${findTech(challenge.language).name} challenge`;
      const others = CHALLENGES.filter(
        (item) => item.language === challenge.language && item.id !== id,
      );
      const start = challenge.number % (others.length - 3);
      const similar: SimilarProblem[] = others
        .slice(start, start + 3)
        .map(({ id: similarId, title, difficulty }) => ({
          id: similarId,
          title,
          difficulty,
          topic,
        }));
      return {
        id,
        status,
        similar,
        ...generatedDetail({ ...challenge, topic, language: challenge.language }),
      };
    }
    throw new ApiError('not_found', 'That problem does not exist.', 404);
  }

  /**
   * Mock judge: the real backend runs the code in a sandbox. Here a solution "passes" once the
   * learner has replaced the starter body; unchanged starter code echoes its input and fails.
   */
  private judge(
    detail: ProblemDetail,
    language: WorkspaceLanguage,
    code: string,
  ): ProblemRunResult {
    const compact = (text: string) => text.replace(/\s+/g, '');
    const untouched =
      compact(code) === compact(detail.starterCode[language]) || /Write code here/.test(code);
    const results = detail.tests.map((test) => {
      const output = untouched ? test.args.replace(/^"|"$/g, '') : test.expected;
      return { testId: test.id, output, passed: output === test.expected };
    });
    return { results, passed: results.every((result) => result.passed), error: null };
  }
  private withStatus(): InterviewProblem[] {
    const solved = new Set(this.progress.get().solvedProblems);
    return PROBLEMS.map((problem) => ({
      ...problem,
      status: solved.has(problem.id) ? 'solved' : 'todo',
    }));
  }

  private summary(): InterviewProgress {
    const solved = { Beginner: 0, Easy: 0, Medium: 0, Hard: 0 };
    for (const problem of this.withStatus()) {
      if (problem.status === 'solved') solved[problem.difficulty]++;
    }
    return { solved, interviewDate: this.progress.get().interviewDate };
  }
}
