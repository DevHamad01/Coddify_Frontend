import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiError } from '../api/api-error';
import { MockDb, MockUserRecord, randomToken } from '../api/mock/mock-db';
import { AuthApi } from './auth-api';
import {
  AuthSession,
  EmailRequest,
  ForgotPasswordResponse,
  GoogleLoginRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
} from './auth.models';

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;

/** In-browser fake of the auth API with realistic latency and error cases. */
@Injectable({ providedIn: 'root' })
export class MockAuthApi extends AuthApi {
  private readonly db = inject(MockDb);

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.db.respond(() => {
      if (this.db.findUser(request.email)) {
        throw new ApiError('email_taken', 'Email already registered.', 409, {
          email: ['Email already registered.'],
        });
      }
      const verificationToken = randomToken('verify');
      const email = request.email.trim().toLowerCase();
      this.db.addUser({
        id: randomToken('u'),
        fullName: request.fullName.trim(),
        email,
        emailVerified: false,
        onboardingCompleted: false,
        password: request.password,
        verificationToken,
      });
      return { email, requiresVerification: true, debugVerificationToken: verificationToken };
    });
  }

  login(request: LoginRequest): Observable<AuthSession> {
    return this.db.respond(() => {
      const user = this.db.findUser(request.email);
      if (!user || user.password !== request.password) {
        throw new ApiError('invalid_credentials', 'Invalid email or password.', 401);
      }
      if (!user.emailVerified) {
        throw new ApiError(
          'email_not_verified',
          'Email not verified. Check your inbox for the verification link.',
          403,
        );
      }
      return this.createSession(user);
    });
  }

  googleLogin(request: GoogleLoginRequest): Observable<AuthSession> {
    return this.db.respond(() => {
      // The mock trusts the credential; the real backend validates it with Google.
      const email = readGoogleEmail(request.idToken) ?? 'google.user@coddify.dev';
      const user =
        this.db.findUser(email) ??
        (() => {
          const created: MockUserRecord = {
            id: randomToken('u'),
            fullName: 'Google Learner',
            email,
            emailVerified: true,
            onboardingCompleted: false,
            password: randomToken('pw'),
          };
          this.db.addUser(created);
          return created;
        })();
      return this.createSession(user);
    });
  }

  verifyEmail(request: VerifyEmailRequest): Observable<MessageResponse> {
    return this.db.respond(() => {
      const user = this.db.findUser(request.email);
      if (!user || !user.verificationToken || user.verificationToken !== request.token) {
        throw new ApiError(
          'invalid_token',
          'This verification link is invalid or has expired.',
          400,
        );
      }
      this.db.updateUser(user.email, { emailVerified: true, verificationToken: undefined });
      return { message: 'Email verified. You can now log in.' };
    });
  }

  resendVerification(request: EmailRequest): Observable<RegisterResponse> {
    return this.db.respond(() => {
      const user = this.db.findUser(request.email);
      // Like a real API, do not reveal whether the email exists.
      if (!user || user.emailVerified) {
        return { email: request.email, requiresVerification: false };
      }
      const verificationToken = randomToken('verify');
      this.db.updateUser(user.email, { verificationToken });
      return {
        email: user.email,
        requiresVerification: true,
        debugVerificationToken: verificationToken,
      };
    });
  }

  forgotPassword(request: EmailRequest): Observable<ForgotPasswordResponse> {
    return this.db.respond(() => {
      const message = 'If an account exists for that email, a reset link is on its way.';
      if (!this.db.findUser(request.email)) {
        return { message };
      }
      const resetToken = randomToken('reset');
      this.db.updateUser(request.email, { resetToken });
      return { message, debugResetToken: resetToken };
    });
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.db.respond(() => {
      const user = this.db.findUser(request.email);
      if (!user || !user.resetToken || user.resetToken !== request.token) {
        throw new ApiError('invalid_token', 'This reset link is invalid or has expired.', 400);
      }
      this.db.updateUser(user.email, { password: request.newPassword, resetToken: undefined });
      return { message: 'Password updated. Log in with your new password.' };
    });
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthSession> {
    return this.db.respond(() => {
      const email = this.db.consumeRefreshToken(request.refreshToken);
      const user = email ? this.db.findUser(email) : undefined;
      if (!user) {
        throw new ApiError('unauthorized', 'Your session has expired. Please log in again.', 401);
      }
      return this.createSession(user);
    });
  }

  logout(): Observable<void> {
    return this.db.respond(() => undefined);
  }

  private createSession(record: MockUserRecord): AuthSession {
    const refreshToken = randomToken('refresh');
    this.db.storeRefreshToken(refreshToken, record.email);
    return {
      accessToken: randomToken('access'),
      refreshToken,
      expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
      user: toUser(record),
    };
  }
}

function toUser(record: MockUserRecord): User {
  const { id, fullName, email, emailVerified, onboardingCompleted, avatarUrl } = record;
  return { id, fullName, email, emailVerified, onboardingCompleted, avatarUrl };
}

/** Reads the `email` claim from a Google JWT without verifying it (mock only). */
function readGoogleEmail(idToken: string): string | undefined {
  try {
    const payload = idToken.split('.')[1];
    if (!payload) {
      return undefined;
    }
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
      email?: unknown;
    };
    return typeof claims.email === 'string' ? claims.email.toLowerCase() : undefined;
  } catch {
    return undefined;
  }
}
