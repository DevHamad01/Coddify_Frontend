import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, toApiError } from '../../core/api/api-error';
import { AuthService } from '../../core/auth/auth.service';
import { OnboardingApi } from '../../core/onboarding/onboarding-api';
import { OnboardingAnswers } from '../../core/onboarding/onboarding.models';
import { Alert } from '../../shared/ui/alert/alert';
import { AnimateOnChange } from '../../shared/ui/animate-on-change/animate-on-change';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CourseSummary } from './components/course-summary/course-summary';
import { MascotBubble } from './components/mascot-bubble/mascot-bubble';
import { OptionTile } from './components/option-tile/option-tile';
import { INTRO_STEP, OnboardingStore, SUMMARY_STEP } from './onboarding.store';
import { recommendCourse } from './recommend-course';

type AnswerValue = NonNullable<OnboardingAnswers[keyof OnboardingAnswers]>;

@Component({
  selector: 'app-onboarding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Alert,
    AnimateOnChange,
    Button,
    Icon,
    ProgressBar,
    CourseSummary,
    MascotBubble,
    OptionTile,
  ],
  providers: [OnboardingStore],
  templateUrl: './onboarding.html',
  host: {
    class: 'flex flex-1 flex-col',
    '(window:keydown)': 'onShortcut($event)',
  },
})
export class Onboarding {
  protected readonly store = inject(OnboardingStore);
  private readonly api = inject(OnboardingApi);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly INTRO = INTRO_STEP;
  protected readonly SUMMARY = SUMMARY_STEP;
  protected readonly saving = signal(false);
  protected readonly saveError = signal<ApiError | null>(null);
  protected readonly firstName = computed(
    () => this.auth.user()?.fullName.split(' ')[0] ?? 'there',
  );

  protected readonly recommendation = computed(() => {
    const answers = this.store.completeAnswers();
    return answers ? recommendCourse(answers) : null;
  });

  /** Mascot says the step's line until an option is picked, then reacts to it. */
  protected readonly mascotText = computed(() => {
    const step = this.store.currentStep();
    const picked = step?.options.find((option) => option.value === this.store.currentValue());
    return picked?.reaction ?? step?.mascotLine ?? '';
  });

  protected choose(value: AnswerValue): void {
    this.store.select(value);
  }

  protected next(): void {
    this.store.next();
    this.focusStep();
  }

  protected back(): void {
    this.store.back();
    this.focusStep();
  }

  /** Arrow keys move the selection inside the radiogroup; Enter continues. */
  protected onGroupKeydown(event: KeyboardEvent): void {
    const options = this.store.currentStep()?.options ?? [];
    const current = options.findIndex((option) => option.value === this.store.currentValue());
    const moves: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    if (event.key === 'Enter') {
      event.preventDefault();
      this.next();
      return;
    }
    const delta = moves[event.key];
    if (delta === undefined || options.length === 0) {
      return;
    }
    event.preventDefault();
    const index = current === -1 ? 0 : (current + delta + options.length) % options.length;
    this.store.select(options[index].value);
    this.focusTile(index);
  }

  /** Number keys pick an option from anywhere on the page (like the reference flow). */
  protected onShortcut(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (event.altKey || event.ctrlKey || event.metaKey || target?.closest('input, textarea')) {
      return;
    }
    const options = this.store.currentStep()?.options ?? [];
    const index = Number(event.key) - 1;
    if (Number.isInteger(index) && index >= 0 && index < options.length) {
      this.store.select(options[index].value);
      this.focusTile(index);
    }
  }

  protected startLearning(): void {
    const answers = this.store.completeAnswers();
    const recommendation = this.recommendation();
    if (!answers || !recommendation) {
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);
    this.api
      .save({ ...answers, recommendedLanguage: recommendation.language.id })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.auth.markOnboardingCompleted();
          this.store.clear();
          this.toast.success(
            `Your plan is saved. Let's write some ${recommendation.language.name}!`,
          );
          void this.router.navigateByUrl('/app');
        },
        error: (error: unknown) => this.saveError.set(toApiError(error)),
      });
  }

  /** After a step change, move focus into the new step so keyboard users keep their place. */
  private focusStep(): void {
    afterNextRender(
      () => {
        const root = this.host.nativeElement;
        const target =
          root.querySelector<HTMLElement>('[role=radio][tabindex="0"]') ??
          root.querySelector<HTMLElement>('h1');
        target?.focus();
      },
      { injector: this.injector },
    );
  }

  private focusTile(index: number): void {
    afterNextRender(
      () => this.host.nativeElement.querySelectorAll<HTMLElement>('[role=radio]')[index]?.focus(),
      { injector: this.injector },
    );
  }
}
