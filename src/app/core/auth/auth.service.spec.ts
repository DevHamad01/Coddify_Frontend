import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

import { ApiError } from '../api/api-error';
import { MOCK_PASSWORD } from '../api/mock/mock-db';
import { provideApis } from '../providers';
import { AuthApi } from './auth-api';
import { AuthService, isSafeReturnUrl } from './auth.service';

/** Runs a mock API call to completion while fake timers skip the simulated latency. */
async function settle<T>(source: Observable<T>): Promise<T> {
  const result = firstValueFrom(source);
  await vi.advanceTimersByTimeAsync(1000);
  return result;
}

async function settleError(source: Observable<unknown>): Promise<ApiError> {
  // Attach the rejection handler before advancing timers so the failure is never "unhandled".
  const outcome = firstValueFrom(source).then(
    () => null,
    (error: unknown) => error as ApiError,
  );
  await vi.advanceTimersByTimeAsync(1000);
  const error = await outcome;
  if (!error) {
    throw new Error('Expected the call to fail');
  }
  return error;
}

describe('AuthService (mock API)', () => {
  let auth: AuthService;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideApis()] });
    auth = TestBed.inject(AuthService);
    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts signed out', () => {
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.user()).toBeNull();
    expect(auth.accessToken()).toBeNull();
  });

  it('logs in a seeded user and persists the session in localStorage when remembered', async () => {
    const user = await settle(
      auth.login({ email: 'demo@coddify.dev', password: MOCK_PASSWORD }, true),
    );

    expect(user.email).toBe('demo@coddify.dev');
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.accessToken()).toMatch(/^access-/);
    expect(localStorage.getItem('coddify.session')).toContain('demo@coddify.dev');
    expect(sessionStorage.getItem('coddify.session')).toBeNull();
  });

  it('uses sessionStorage when "remember me" is off', async () => {
    await settle(auth.login({ email: 'demo@coddify.dev', password: MOCK_PASSWORD }, false));
    expect(sessionStorage.getItem('coddify.session')).not.toBeNull();
    expect(localStorage.getItem('coddify.session')).toBeNull();
  });

  it('rejects wrong credentials with a typed error', async () => {
    const error = await settleError(
      auth.login({ email: 'demo@coddify.dev', password: 'nope' }, true),
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('invalid_credentials');
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('blocks unverified accounts', async () => {
    const error = await settleError(
      auth.login({ email: 'unverified@coddify.dev', password: MOCK_PASSWORD }, true),
    );
    expect(error.code).toBe('email_not_verified');
  });

  it('registers, verifies the email and then logs in', async () => {
    const request = {
      fullName: 'Ayesha Khan',
      email: 'ayesha@example.com',
      password: 'Coddify2026',
    };
    const registered = await settle(auth.register(request));
    expect(registered.requiresVerification).toBe(true);

    const duplicate = await settleError(auth.register(request));
    expect(duplicate.code).toBe('email_taken');

    const beforeVerify = await settleError(
      auth.login({ email: request.email, password: request.password }, true),
    );
    expect(beforeVerify.code).toBe('email_not_verified');

    await settle(
      auth.verifyEmail({ email: request.email, token: registered.debugVerificationToken ?? '' }),
    );
    const user = await settle(
      auth.login({ email: request.email, password: request.password }, true),
    );
    expect(user.fullName).toBe('Ayesha Khan');
    expect(user.onboardingCompleted).toBe(false);
  });

  it('refreshes the access token once for concurrent callers', async () => {
    await settle(auth.login({ email: 'demo@coddify.dev', password: MOCK_PASSWORD }, true));
    const oldToken = auth.accessToken();
    const api = TestBed.inject(AuthApi);
    const refreshSpy = vi.spyOn(api, 'refreshToken');

    const first = firstValueFrom(auth.refreshAccessToken());
    const second = firstValueFrom(auth.refreshAccessToken());
    await vi.advanceTimersByTimeAsync(1000);

    const [a, b] = await Promise.all([first, second]);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
    expect(a).not.toBe(oldToken);
    expect(auth.accessToken()).toBe(a);
  });

  it('logs out and clears storage', async () => {
    await settle(auth.login({ email: 'demo@coddify.dev', password: MOCK_PASSWORD }, true));
    auth.logout();
    expect(auth.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('coddify.session')).toBeNull();
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('sends users with unfinished onboarding to /onboarding, ignoring returnUrl', async () => {
    await settle(auth.login({ email: 'new@coddify.dev', password: MOCK_PASSWORD }, true));
    await auth.navigateAfterLogin('/app/lessons');
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding');
  });

  it('honours a safe returnUrl for onboarded users and ignores unsafe ones', async () => {
    await settle(auth.login({ email: 'demo@coddify.dev', password: MOCK_PASSWORD }, true));
    await auth.navigateAfterLogin('/app/lessons');
    expect(navigateByUrl).toHaveBeenLastCalledWith('/app/lessons');

    await auth.navigateAfterLogin('//evil.example.com');
    expect(navigateByUrl).toHaveBeenLastCalledWith('/app');
  });

  it('marks onboarding as completed in the session', async () => {
    await settle(auth.login({ email: 'new@coddify.dev', password: MOCK_PASSWORD }, true));
    auth.markOnboardingCompleted();
    expect(auth.user()?.onboardingCompleted).toBe(true);
    expect(auth.homeRoute()).toBe('/app');
  });
});

describe('isSafeReturnUrl', () => {
  it.each([
    ['/app', true],
    ['/app/lessons?x=1', true],
    ['//evil.com', false],
    ['/\\evil.com', false],
    ['https://evil.com', false],
    ['', false],
    [null, false],
  ])('%s → %s', (url, expected) => {
    expect(isSafeReturnUrl(url)).toBe(expected);
  });
});
