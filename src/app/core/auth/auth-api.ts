import { Observable } from 'rxjs';

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
  VerifyEmailRequest,
} from './auth.models';

/**
 * Auth backend contract. Implemented by `HttpAuthApi` (real .NET API) and `MockAuthApi`
 * (in-browser fake). Used as the DI token; see `provideApis()` for which one is injected.
 * All methods fail with an `ApiError`.
 */
export abstract class AuthApi {
  abstract register(request: RegisterRequest): Observable<RegisterResponse>;
  abstract login(request: LoginRequest): Observable<AuthSession>;
  abstract googleLogin(request: GoogleLoginRequest): Observable<AuthSession>;
  abstract verifyEmail(request: VerifyEmailRequest): Observable<MessageResponse>;
  abstract resendVerification(request: EmailRequest): Observable<RegisterResponse>;
  abstract forgotPassword(request: EmailRequest): Observable<ForgotPasswordResponse>;
  abstract resetPassword(request: ResetPasswordRequest): Observable<MessageResponse>;
  abstract refreshToken(request: RefreshTokenRequest): Observable<AuthSession>;
  /** Revokes the refresh token on the server (needs the access token). */
  abstract logout(): Observable<void>;
}
