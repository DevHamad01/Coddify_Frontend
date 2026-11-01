import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { APP_ENV } from '../config/environment';
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
  VerifyEmailRequest,
} from './auth.models';

/** Real backend implementation. Errors are mapped to `ApiError` by `errorInterceptor`. */
@Injectable({ providedIn: 'root' })
export class HttpAuthApi extends AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;
  private readonly paths = API_ENDPOINTS.auth;

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url(this.paths.register), request);
  }

  login(request: LoginRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(this.url(this.paths.login), request);
  }

  googleLogin(request: GoogleLoginRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(this.url(this.paths.googleLogin), request);
  }

  verifyEmail(request: VerifyEmailRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.url(this.paths.verifyEmail), request);
  }

  resendVerification(request: EmailRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url(this.paths.resendVerification), request);
  }

  forgotPassword(request: EmailRequest): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(this.url(this.paths.forgotPassword), request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.url(this.paths.resetPassword), request);
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthSession> {
    return this.http.post<AuthSession>(this.url(this.paths.refreshToken), request);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.url(API_ENDPOINTS.account.logout), {});
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
