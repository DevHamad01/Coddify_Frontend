import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

import {
  CompleteOnboardingAnswers,
  OnboardingAnswers,
} from '../../core/onboarding/onboarding.models';
import { ONBOARDING_STEPS } from './onboarding-steps';

/** -1 = intro screen, 0..3 = question steps, 4 = summary. */
export type StepIndex = number;
export const INTRO_STEP = -1;
export const SUMMARY_STEP = ONBOARDING_STEPS.length;

const STORAGE_KEY = 'coddify.onboarding';
const EMPTY: OnboardingAnswers = {
  goal: null,
  language: null,
  experience: null,
  dailyMinutes: null,
};

interface Snapshot {
  readonly step: StepIndex;
  readonly answers: OnboardingAnswers;
}

/**
 * Signal store for the onboarding flow. Mirrors itself to sessionStorage so a refresh
 * in the same tab keeps progress. Provided by the Onboarding page (one instance per visit).
 */
@Injectable()
export class OnboardingStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly initial = this.restore();

  readonly step = signal<StepIndex>(this.initial.step);
  readonly answers = signal<OnboardingAnswers>(this.initial.answers);
  /** +1 when moving forward, -1 when going back; drives the slide direction. */
  readonly direction = signal<1 | -1>(1);

  readonly currentStep = computed(() => ONBOARDING_STEPS[this.step()] ?? null);
  readonly currentValue = computed(() => {
    const step = this.currentStep();
    return step ? this.answers()[step.key] : null;
  });
  readonly canContinue = computed(() => this.currentValue() !== null);
  /** 0–100 for the top progress bar; counts the step you are on, so step 1 is already partly filled. */
  readonly progress = computed(() =>
    this.step() < 0 ? 0 : ((this.step() + 1) / (SUMMARY_STEP + 1)) * 100,
  );
  readonly completeAnswers = computed<CompleteOnboardingAnswers | null>(() => {
    const { goal, language, experience, dailyMinutes } = this.answers();
    return goal && language && experience && dailyMinutes
      ? { goal, language, experience, dailyMinutes }
      : null;
  });

  constructor() {
    effect(() => this.persist({ step: this.step(), answers: this.answers() }));
  }

  /** Records an answer for the current step. */
  select(value: NonNullable<OnboardingAnswers[keyof OnboardingAnswers]>): void {
    const step = this.currentStep();
    if (step) {
      this.answers.update((answers) => ({ ...answers, [step.key]: value }));
    }
  }

  next(): void {
    if (this.step() === INTRO_STEP || this.canContinue()) {
      this.go(Math.min(SUMMARY_STEP, this.step() + 1), 1);
    }
  }

  back(): void {
    this.go(Math.max(INTRO_STEP, this.step() - 1), -1);
  }

  /** Clears saved progress once onboarding is submitted. */
  clear(): void {
    this.answers.set(EMPTY);
    this.step.set(INTRO_STEP);
    if (this.isBrowser) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing stored.
      }
    }
  }

  private go(step: StepIndex, direction: 1 | -1): void {
    this.direction.set(direction);
    this.step.set(step);
  }

  private persist(snapshot: Snapshot): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage unavailable: progress just won't survive a refresh.
    }
  }

  private restore(): Snapshot {
    const fresh: Snapshot = { step: INTRO_STEP, answers: EMPTY };
    if (!this.isBrowser) {
      return fresh;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as Partial<Snapshot>) : null;
      if (!saved || typeof saved.step !== 'number' || !saved.answers) {
        return fresh;
      }
      const step = Math.min(Math.max(saved.step, INTRO_STEP), SUMMARY_STEP);
      return { step, answers: { ...EMPTY, ...saved.answers } };
    } catch {
      return fresh;
    }
  }
}
