import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';

import { AuthApi } from './auth/auth-api';
import { HttpAuthApi } from './auth/http-auth-api';
import { MockAuthApi } from './auth/mock-auth-api';
import { APP_ENV } from './config/environment';
import { HttpOnboardingApi, MockOnboardingApi, OnboardingApi } from './onboarding/onboarding-api';

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
  ]);
}
