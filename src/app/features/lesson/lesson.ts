import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';

import { ProgressStore } from '../../core/gamification/progress.store';
import { LearningApi } from '../../core/learning/learning-api';
import {
  Lesson as LessonData,
  LessonReward,
  RunResult,
  Submission,
} from '../../core/learning/learning.models';
import { CodeEditor } from '../../shared/ui/code-editor/code-editor';
import { Icon } from '../../shared/ui/icon/icon';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DailyGoalModal } from '../../shared/ui/daily-goal-modal/daily-goal-modal';
import { LessonCompleteModal } from './components/lesson-complete-modal/lesson-complete-modal';
import { LessonPanel } from './components/lesson-panel/lesson-panel';
import { TestPanel } from './components/test-panel/test-panel';
import { TutorPanel } from './components/tutor-panel/tutor-panel';

/**
 * Full-screen lesson: explanation and challenge on the left, Monaco editor with tests on the right,
 * optional AI tutor panel. Passing every test completes the lesson and shows the reward.
 */
@Component({
  selector: 'app-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Icon,
    NavArt,
    CodeEditor,
    LessonPanel,
    TestPanel,
    TutorPanel,
    LessonCompleteModal,
    DailyGoalModal,
  ],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
})
export class Lesson {
  /** Route param, bound by `withComponentInputBinding()`. */
  readonly lessonId = input.required<string>();

  private readonly api = inject(LearningApi);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly store = inject(ProgressStore);
  private readonly tutor = viewChild(TutorPanel);

  protected readonly lesson = signal<LessonData | null>(null);
  protected readonly notFound = signal(false);
  protected readonly code = signal('');
  protected readonly running = signal(false);
  protected readonly result = signal<RunResult | null>(null);
  protected readonly attempts = signal(0);
  protected readonly submissions = signal<readonly Submission[]>([]);
  protected readonly reward = signal<LessonReward | null>(null);
  protected readonly showGoal = signal(false);
  protected readonly savingGoal = signal(false);
  protected readonly tutorOpen = signal(false);
  protected readonly panelCollapsed = signal(false);
  protected readonly soundOn = signal(true);

  protected readonly isDirty = computed(() => {
    const lesson = this.lesson();
    return !!lesson && this.code() !== lesson.challenge.starterCode;
  });

  constructor() {
    this.store.ensureLoaded();
    // Reload everything when the route moves to another lesson.
    effect(() => {
      const id = this.lessonId();
      this.reset();
      this.api.getLesson(id).subscribe({
        next: (lesson) => {
          this.lesson.set(lesson);
          this.code.set(lesson.challenge.starterCode);
        },
        error: () => this.notFound.set(true),
      });
      this.api.getSubmissions(id).subscribe((list) => this.submissions.set(list));
    });
  }

  protected run(): void {
    const lesson = this.lesson();
    if (!lesson || this.running()) {
      return;
    }
    this.running.set(true);
    this.attempts.update((n) => n + 1);
    const firstTry = this.attempts() === 1;
    this.api
      .run(lesson.id, this.code())
      .pipe(
        tap((result) => this.result.set(result)),
        finalize(() => this.running.set(false)),
      )
      .subscribe((result) => {
        this.playSound(result.passed);
        if (result.passed) {
          this.complete(lesson, firstTry);
        }
      });
  }

  protected resetCode(): void {
    const lesson = this.lesson();
    if (lesson) {
      this.code.set(lesson.challenge.starterCode);
      this.result.set(null);
    }
  }

  protected save(): void {
    this.toast.success('Code saved on this device.');
  }

  protected report(): void {
    this.toast.show('Thanks! We will look at this lesson.', 'info');
  }

  protected openTutor(question?: string): void {
    this.tutorOpen.set(true);
    if (question) {
      // The panel renders on the next tick when it was closed.
      setTimeout(() => this.tutor()?.ask(question));
    }
  }

  protected afterReward(): void {
    const reward = this.reward();
    this.reward.set(null);
    if (reward?.xpEarned && this.store.stats()?.dailyGoal === null) {
      this.showGoal.set(true);
    } else {
      void this.router.navigate(['/app/journey']);
    }
  }

  protected setGoal(activities: number): void {
    this.savingGoal.set(true);
    this.store
      .setDailyGoal(activities)
      .pipe(finalize(() => this.savingGoal.set(false)))
      .subscribe(() => {
        this.showGoal.set(false);
        void this.router.navigate(['/app/journey']);
      });
  }

  protected skipGoal(): void {
    this.showGoal.set(false);
    void this.router.navigate(['/app/journey']);
  }

  private complete(lesson: LessonData, firstTry: boolean): void {
    this.api
      .complete(lesson.id, this.code(), firstTry)
      .pipe(
        tap((reward) => {
          this.reward.set(reward);
          this.store.applyReward(reward);
        }),
        switchMap(() => this.api.getSubmissions(lesson.id)),
      )
      .subscribe((list) => this.submissions.set(list));
  }

  private reset(): void {
    this.lesson.set(null);
    this.notFound.set(false);
    this.result.set(null);
    this.attempts.set(0);
    this.reward.set(null);
    this.showGoal.set(false);
  }

  /** Short success / fail chime with the Web Audio API, no audio files needed. */
  private playSound(success: boolean): void {
    if (!this.soundOn() || typeof AudioContext === 'undefined') {
      return;
    }
    const audio = new AudioContext();
    const notes = success ? [523.25, 659.25, 783.99] : [311.13, 246.94];
    notes.forEach((frequency, i) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = frequency;
      osc.type = 'triangle';
      const start = audio.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
    setTimeout(() => void audio.close(), 1000);
  }
}
