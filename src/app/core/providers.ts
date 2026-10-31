import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { AuthApi } from './auth/auth-api';
import { HttpAuthApi } from './auth/http-auth-api';
import { MockAuthApi } from './auth/mock-auth-api';
import { APP_ENV } from './config/environment';
import {
  GamificationApi,
  HttpGamificationApi,
  MockGamificationApi,
} from './gamification/gamification-api';
import { HttpLearningApi, LearningApi, MockLearningApi } from './learning/learning-api';
import { HttpOnboardingApi, MockOnboardingApi, OnboardingApi } from './onboarding/onboarding-api';
import { HttpPracticeApi, MockPracticeApi, PracticeApi } from './practice/practice-api';

/**
 * Binds each API contract to its mock or HTTP implementation based on `useMockApi`.
 * Add new feature APIs here (see docs/frontend-conventions.md).
 */
export function provideApis(): EnvironmentProviders {
  const useMock = () => inject(APP_ENV).useMockApi;
  return makeEnvironmentProviders([
    { provide: AuthApi, useFactory: () => (useMock() ? inject(MockAuthApi) : inject(HttpAuthApi)) },
    {
      provide: OnboardingApi,
      useFactory: () => (useMock() ? inject(MockOnboardingApi) : inject(HttpOnboardingApi)),
    },
    {
      provide: LearningApi,
      useFactory: () => (useMock() ? inject(MockLearningApi) : inject(HttpLearningApi)),
    },
    {
      provide: GamificationApi,
      useFactory: () => (useMock() ? inject(MockGamificationApi) : inject(HttpGamificationApi)),
    },
    {
      provide: PracticeApi,
      useFactory: () => (useMock() ? inject(MockPracticeApi) : inject(HttpPracticeApi)),
    },
  ]);
}
