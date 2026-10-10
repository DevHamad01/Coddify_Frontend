/** DTOs shared by the HTTP and mock auth APIs. Field names match the backend's camelCase JSON. */

export interface User {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly onboardingCompleted: boolean;
  readonly avatarUrl?: string | null;
}

export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  /** ISO date when the access token expires. */
  readonly expiresAt: string;
  readonly user: User;
}

export interface RegisterRequest {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

export interface RegisterResponse {
  readonly email: string;
  readonly requiresVerification: boolean;
  /** Only returned by the mock API so the demo can "click" the email link. Never sent by the backend. */
  readonly debugVerificationToken?: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface GoogleLoginRequest {
  /** ID token (JWT credential) from Google Identity Services. */
  readonly idToken: string;
}

export interface VerifyEmailRequest {
  readonly email: string;
  readonly token: string;
}

export interface EmailRequest {
  readonly email: string;
}

export interface ResetPasswordRequest {
  readonly email: string;
  readonly token: string;
  readonly newPassword: string;
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

export interface MessageResponse {
  readonly message: string;
}

export interface ForgotPasswordResponse extends MessageResponse {
  /** Only returned by the mock API so the demo can open the reset link. Never sent by the backend. */
  readonly debugResetToken?: string;
}
