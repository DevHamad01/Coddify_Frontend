import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { User } from '../auth/auth.models';
import { AuthService } from '../auth/auth.service';
import { authGuard, guestGuard, onboardingGuard, onboardingPendingGuard } from './auth.guards';

const baseUser: User = {
  id: 'u1',
  fullName: 'Test User',
  email: 'test@example.com',
  emailVerified: true,
  onboardingCompleted: true,
};

function setup(user: User | null): void {
  const current = signal(user);
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: { user: current, isAuthenticated: () => current() !== null },
      },
    ],
  });
}

function run(guard: CanActivateFn, url = '/app'): MaybeAsync<GuardResult> {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  );
}

function redirectOf(result: MaybeAsync<GuardResult>): string {
  expect(result).toBeInstanceOf(UrlTree);
  return (result as UrlTree).toString();
}

describe('auth guards', () => {
  describe('authGuard', () => {
    it('lets signed-in users through', () => {
      setup(baseUser);
      expect(run(authGuard)).toBe(true);
    });

    it('redirects guests to /login with the original url as returnUrl', () => {
      setup(null);
      expect(redirectOf(run(authGuard, '/app/lessons'))).toBe('/login?returnUrl=%2Fapp%2Flessons');
    });
  });

  describe('guestGuard', () => {
    it('lets guests through', () => {
      setup(null);
      expect(run(guestGuard)).toBe(true);
    });

    it('sends signed-in users to /app', () => {
      setup(baseUser);
      expect(redirectOf(run(guestGuard))).toBe('/app');
    });
  });

  describe('onboardingGuard', () => {
    it('sends users who have not finished onboarding to /onboarding', () => {
      setup({ ...baseUser, onboardingCompleted: false });
      expect(redirectOf(run(onboardingGuard))).toBe('/onboarding');
    });

    it('lets onboarded users into the app', () => {
      setup(baseUser);
      expect(run(onboardingGuard)).toBe(true);
    });
  });

  describe('onboardingPendingGuard', () => {
    it('skips onboarding for users who already finished it', () => {
      setup(baseUser);
      expect(redirectOf(run(onboardingPendingGuard))).toBe('/app');
    });

    it('allows users who still need onboarding', () => {
      setup({ ...baseUser, onboardingCompleted: false });
      expect(run(onboardingPendingGuard)).toBe(true);
    });
  });
});
