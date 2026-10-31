import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { MockDb } from '../api/mock/mock-db';
import { MockProgress } from '../api/mock/mock-progress';
import { APP_ENV } from '../config/environment';
import { PROBLEMS, TOPICS } from './mock/problems.mock';
import {
  DIFFICULTIES,
  InterviewProblem,
  InterviewProgress,
  InterviewSet,
  Page,
  ProblemQuery,
} from './practice.models';

/** Interview-prep problem bank and progress; bound in `provideApis()`. */
export abstract class PracticeApi {
  abstract getProblems(query: ProblemQuery): Observable<Page<InterviewProblem>>;
  abstract getTopics(): Observable<readonly string[]>;
  abstract getTodaySet(): Observable<InterviewSet>;
  abstract getProgress(): Observable<InterviewProgress>;
  abstract setInterviewDate(date: string | null): Observable<InterviewProgress>;
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
}

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
