import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, map, switchMap, tap } from 'rxjs';

import { toApiError } from '../../core/api/api-error';
import { ProgressStore } from '../../core/gamification/progress.store';
import { PracticeApi } from '../../core/practice/practice-api';
import {
  ProblemDetail,
  ProblemRunResult,
  ProblemSubmission,
  WorkspaceLanguage,
} from '../../core/practice/practice.models';
import { CodeEditor } from '../../shared/ui/code-editor/code-editor';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ProblemDescription } from './components/problem-description/problem-description';
import { ProblemHints } from './components/problem-hints/problem-hints';
import { ProblemSolution } from './components/problem-solution/problem-solution';
import { ProblemSubmissions } from './components/problem-submissions/problem-submissions';
import { SimilarProblems } from './components/similar-problems/similar-problems';
import { TestCases } from './components/test-cases/test-cases';

type Tab = 'description' | 'hints' | 'solution' | 'similar' | 'submissions';

const TABS: readonly { id: Tab; label: string; icon: IconName }[] = [
  { id: 'description', label: 'Description', icon: 'file-text' },
  { id: 'hints', label: 'Hints', icon: 'lightbulb' },
  { id: 'solution', label: 'Solution', icon: 'target' },
  { id: 'similar', label: 'Similar', icon: 'layers' },
  { id: 'submissions', label: 'Submissions', icon: 'history' },
];

const LANGUAGE_LABEL: Record<WorkspaceLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++',
};

const DRAFT_KEY = 'coddify.problem-draft';

/**
 * Full-screen workspace for interview problems and challenges: statement, hints, solution and
 * similar problems on the left; Monaco editor and test cases on the right.
 */
@Component({
  selector: 'app-problem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    CodeEditor,
    Icon,
    NavArt,
    ProblemDescription,
    ProblemHints,
    ProblemSolution,
    SimilarProblems,
    ProblemSubmissions,
    TestCases,
  ],
  templateUrl: './problem.html',
  styleUrl: './problem.scss',
})
export class Problem {
  private readonly api = inject(PracticeApi);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly store = inject(ProgressStore);

  protected readonly tabs = TABS;
  protected readonly labels = LANGUAGE_LABEL;
  protected readonly problem = signal<ProblemDetail | null>(null);
  protected readonly notFound = signal(false);
  protected readonly tab = signal<Tab>(
    (this.route.snapshot.queryParamMap.get('tab') as Tab | null) ?? 'description',
  );
  protected readonly language = signal<WorkspaceLanguage>('python');
  protected readonly code = signal('');
  protected readonly result = signal<ProblemRunResult | null>(null);
  protected readonly running = signal<'run' | 'submit' | null>(null);
  protected readonly submissions = signal<readonly ProblemSubmission[] | null>(null);
  protected readonly testsOpen = signal(true);

  /** Challenges link back to the challenge list, interview problems to the interview bank. */
  protected readonly backLink = computed(() =>
    this.problem()?.id.startsWith('c-') ? '/app/practice' : '/app/interview',
  );
  protected readonly backQuery = computed(() =>
    this.problem()?.id.startsWith('c-') ? { tab: 'challenges' } : {},
  );

  constructor() {
    this.store.ensureLoaded();
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        tap(() => {
          this.problem.set(null);
          this.result.set(null);
          this.submissions.set(null);
        }),
        switchMap((id) => this.api.getProblem(id)),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (problem) => {
          this.problem.set(problem);
          this.notFound.set(false);
          this.setLanguage(problem.defaultLanguage, problem);
          this.loadSubmissions();
        },
        error: () => this.notFound.set(true),
      });
  }

  protected selectTab(tab: Tab): void {
    this.tab.set(tab);
    void this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
  }

  protected setLanguage(language: WorkspaceLanguage, problem = this.problem()): void {
    if (!problem) {
      return;
    }
    this.language.set(language);
    this.code.set(this.readDraft(problem.id, language) ?? problem.starterCode[language]);
    this.result.set(null);
  }

  protected save(): void {
    const problem = this.problem();
    if (!problem || !this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(this.draftKey(problem.id, this.language()), this.code());
      this.toast.success('Draft saved.');
    } catch {
      this.toast.error('Could not save the draft in this browser.');
    }
  }

  protected reset(): void {
    const problem = this.problem();
    if (!problem) {
      return;
    }
    this.code.set(problem.starterCode[this.language()]);
    this.result.set(null);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.draftKey(problem.id, this.language()));
      } catch {
        // Nothing saved to clear.
      }
    }
  }

  protected run(): void {
    this.execute('run');
  }

  protected submit(): void {
    this.execute('submit');
  }

  protected askAi(): void {
    this.selectTab('hints');
    this.toast.info('The AI tutor for problems arrives with the backend. Try a hint for now!');
  }

  protected loadSubmission(submission: ProblemSubmission): void {
    this.language.set(submission.language);
    this.code.set(submission.code);
    this.toast.info('Submission loaded into the editor.');
  }

  private execute(mode: 'run' | 'submit'): void {
    const problem = this.problem();
    if (!problem || this.running()) {
      return;
    }
    this.running.set(mode);
    this.testsOpen.set(true);
    const call =
      mode === 'run'
        ? this.api.runProblem(problem.id, this.language(), this.code())
        : this.api.submitProblem(problem.id, this.language(), this.code());
    call.pipe(finalize(() => this.running.set(null))).subscribe({
      next: (result) => {
        this.result.set(result);
        if (mode === 'submit') {
          this.loadSubmissions();
          if (result.passed) {
            this.toast.success(`Accepted! ${problem.title} solved.`);
            this.problem.set({ ...problem, status: 'solved' });
            this.store.refresh();
          } else {
            this.toast.error('Not quite. Check the failing tests.');
          }
        }
      },
      error: (error: unknown) => this.toast.error(toApiError(error).message),
    });
  }

  private loadSubmissions(): void {
    const problem = this.problem();
    if (problem) {
      this.api
        .getProblemSubmissions(problem.id)
        .subscribe((submissions) => this.submissions.set(submissions));
    }
  }

  private draftKey(id: string, language: WorkspaceLanguage): string {
    return `${DRAFT_KEY}.${id}.${language}`;
  }

  private readDraft(id: string, language: WorkspaceLanguage): string | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      return localStorage.getItem(this.draftKey(id, language));
    } catch {
      return null;
    }
  }
}
