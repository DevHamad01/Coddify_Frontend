import { LanguageId } from '../../shared/data/languages';

export type Goal = 'job' | 'university' | 'freelancing' | 'fun';
export type LanguageChoice = LanguageId | 'unsure';
export type Experience = 'beginner' | 'some' | 'comfortable';
export type DailyMinutes = 5 | 10 | 15 | 20;

/** What the learner picked. Every field is null until answered. */
export interface OnboardingAnswers {
  readonly goal: Goal | null;
  readonly language: LanguageChoice | null;
  readonly experience: Experience | null;
  readonly dailyMinutes: DailyMinutes | null;
}

export type CompleteOnboardingAnswers = {
  readonly [K in keyof OnboardingAnswers]: NonNullable<OnboardingAnswers[K]>;
};

/** Body of POST /api/onboarding. */
export interface SaveOnboardingRequest extends CompleteOnboardingAnswers {
  readonly recommendedLanguage: LanguageId;
}

export interface SaveOnboardingResponse {
  readonly onboardingCompleted: true;
}
