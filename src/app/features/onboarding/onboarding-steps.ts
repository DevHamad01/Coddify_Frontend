import { OnboardingAnswers } from '../../core/onboarding/onboarding.models';
import { LANGUAGES, LanguageId } from '../../shared/data/languages';
import { IconName } from '../../shared/ui/icon/icons';
import { MascotPose } from '../../shared/ui/mascot/mascot';

export interface StepOption<T> {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
  readonly languageId?: LanguageId;
  /** What the mascot says once this option is picked. */
  readonly reaction: string;
}

export interface OnboardingStep<K extends keyof OnboardingAnswers = keyof OnboardingAnswers> {
  readonly key: K;
  readonly question: string;
  readonly mascotPose: MascotPose;
  readonly mascotLine: string;
  readonly options: readonly StepOption<NonNullable<OnboardingAnswers[K]>>[];
}

const GOAL_STEP: OnboardingStep<'goal'> = {
  key: 'goal',
  question: 'What brings you to Coddify?',
  mascotPose: 'happy',
  mascotLine: "Hoot! I'm Owlbit. Let's set things up for you.",
  options: [
    {
      value: 'job',
      label: 'Get a job',
      description: 'Land an internship or first dev role',
      icon: 'briefcase',
      reaction: 'Love it. We will focus on skills employers test.',
    },
    {
      value: 'university',
      label: 'Ace university courses',
      description: 'Breeze through labs and exams',
      icon: 'graduation',
      reaction: 'Nice! Your PF and OOP courses will feel easy.',
    },
    {
      value: 'freelancing',
      label: 'Freelancing',
      description: 'Earn from client projects',
      icon: 'laptop',
      reaction: 'Smart. Practical, client-ready skills it is.',
    },
    {
      value: 'fun',
      label: 'Just for fun',
      description: 'Build cool things, learn something new',
      icon: 'gamepad',
      reaction: 'The best reason! Curiosity takes you far.',
    },
  ],
};

const LANGUAGE_STEP: OnboardingStep<'language'> = {
  key: 'language',
  question: 'Which language do you want to learn?',
  mascotPose: 'thinking',
  mascotLine: 'Pick one, or let me choose for you.',
  options: [
    ...LANGUAGES.map((language) => ({
      value: language.id,
      label: language.name,
      description: language.tagline,
      languageId: language.id,
      reaction: `${language.name}, great pick!`,
    })),
    {
      value: 'unsure',
      label: 'Not sure, recommend one',
      description: "I'll match you to a language",
      icon: 'compass',
      reaction: 'Leave it to me. I will find your perfect match.',
    },
  ],
};

const EXPERIENCE_STEP: OnboardingStep<'experience'> = {
  key: 'experience',
  question: 'How much coding have you done?',
  mascotPose: 'thinking',
  mascotLine: "No wrong answers here, I'll adjust the pace.",
  options: [
    {
      value: 'beginner',
      label: 'Complete beginner',
      description: "I've never written code",
      icon: 'sparkles',
      reaction: 'Perfect. We start from zero, step by step.',
    },
    {
      value: 'some',
      label: 'I know a little',
      description: "I've followed a few tutorials",
      icon: 'code',
      reaction: 'Good base! We will fill the gaps quickly.',
    },
    {
      value: 'comfortable',
      label: "I'm comfortable",
      description: 'I can write small programs',
      icon: 'bolt',
      reaction: 'Great, expect more challenges and fewer basics.',
    },
  ],
};

const DAILY_STEP: OnboardingStep<'dailyMinutes'> = {
  key: 'dailyMinutes',
  question: 'Pick a daily goal',
  mascotPose: 'happy',
  mascotLine: 'Small and steady beats long and rare.',
  options: [
    {
      value: 5,
      label: 'Casual',
      description: '5 min / day',
      icon: 'clock',
      reaction: 'Easy to keep. Perfect for busy days.',
    },
    {
      value: 10,
      label: 'Regular',
      description: '10 min / day',
      icon: 'clock',
      reaction: 'The sweet spot for most learners!',
    },
    {
      value: 15,
      label: 'Serious',
      description: '15 min / day',
      icon: 'clock',
      reaction: 'Serious mode on. You will move fast.',
    },
    {
      value: 20,
      label: 'Intense',
      description: '20 min / day',
      icon: 'flame',
      reaction: 'Whoa, intense! I like your energy.',
    },
  ],
};

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  GOAL_STEP,
  LANGUAGE_STEP,
  EXPERIENCE_STEP,
  DAILY_STEP,
];
