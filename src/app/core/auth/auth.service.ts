import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, from, map, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { ApiError } from '../api/api-error';
import { AuthApi } from './auth-api';
import {
  AuthSession,
  ForgotPasswordResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
} from './auth.models';
import { GoogleIdentityService } from './google-identity.service';
import { TokenStorage } from './token-storage';

/**
 * Owns the signed-in session. Tokens live in memory (signals) and are mirrored to browser
 * storage by `TokenStorage`. All network calls go through the injected `AuthApi`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);
  private readonly storage = inject(TokenStorage);
  private readonly google = inject(GoogleIdentityService);
  private readonly router = inject(Router);

  private readonly session = signal<AuthSession | null>(null);
  private remember = true;
  private refreshInFlight: Observable<string> | null = null;

  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly accessToken = computed<string | null>(() => this.session()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  constructor() {
    const stored = this.storage.load();
    if (stored) {
      this.session.set(stored.session);
      this.remember = stored.remember;
    }
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.api.register(request);
  }

  login(request: LoginRequest, remember: boolean): Observable<User> {
    return this.api.login(request).pipe(
      tap((session) => this.startSession(session, remember)),
      map((session) => session.user),
    );
  }

  /** Opens Google's sign-in prompt, then exchanges the ID token with our API. */
  loginWithGoogle(): Observable<User> {
    return from(this.google.requestIdToken()).pipe(
      switchMap((idToken) => this.api.googleLogin({ idToken })),
      tap((session) => this.startSession(session, true)),
      map((session) => session.user),
    );
  }

  verifyEmail(request: VerifyEmailRequest): Observable<MessageResponse> {
    return this.api.verifyEmail(request);
  }

  resendVerification(email: string): Observable<RegisterResponse> {
    return this.api.resendVerification({ email });
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.api.forgotPassword({ email });
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.api.resetPassword(request);
  }

  /**
   * Exchanges the refresh token for a new session. Concurrent callers share one request,
   * so a burst of 401s triggers a single refresh.
   */
  refreshAccessToken(): Observable<string> {
    const refreshToken = this.session()?.refreshToken;
    if (!refreshToken) {
      return throwError(
        () => new ApiError('unauthorized', 'Your session has expired. Please log in again.', 401),
      );
    }
    this.refreshInFlight ??= this.api.refreshToken({ refreshToken }).pipe(
      tap((session) => this.startSession(session, this.remember)),
      map((session) => session.accessToken),
      finalize(() => (this.refreshInFlight = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.refreshInFlight;
  }

  logout(redirectTo: string | null = '/'): void {
    this.session.set(null);
    this.storage.clear();
    if (redirectTo !== null) {
      void this.router.navigateByUrl(redirectTo);
    }
  }

  markOnboardingCompleted(): void {
    const current = this.session();
    if (current) {
      this.startSession(
        { ...current, user: { ...current.user, onboardingCompleted: true } },
        this.remember,
      );
    }
  }

  /** Keeps the signed-in user's name in step after an Edit profile save. */
  updateFullName(fullName: string): void {
    const current = this.session();
    if (current && fullName) {
      this.startSession({ ...current, user: { ...current.user, fullName } }, this.remember);
    }
  }

  /** Where a signed-in user belongs: onboarding first, then the app. */
  homeRoute(): string {
    return this.user()?.onboardingCompleted ? '/app' : '/onboarding';
  }

  /** After login: unfinished onboarding wins; otherwise honour a safe in-app returnUrl. */
  navigateAfterLogin(returnUrl?: string | null): Promise<boolean> {
    const home = this.homeRoute();
    const target = home === '/app' && isSafeReturnUrl(returnUrl) ? returnUrl : home;
    return this.router.navigateByUrl(target);
  }

  private startSession(session: AuthSession, remember: boolean): void {
    this.remember = remember;
    this.session.set(session);
    this.storage.save(session, remember);
  }
}

/** Only same-app absolute paths; blocks "//evil.com" and full URLs (open redirect). */
export function isSafeReturnUrl(url: string | null | undefined): url is string {
  return !!url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\');
}
