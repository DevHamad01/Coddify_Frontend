/**
 * REST paths of the .NET API (relative to `apiBaseUrl`). Adjust here when the backend is merged;
 * nothing else in the app hard-codes a URL.
 */
export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    googleLogin: '/api/auth/google-login',
    verifyEmail: '/api/auth/verify-email',
    resendVerification: '/api/auth/resend-verification',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    refreshToken: '/api/auth/refresh-token',
  },
  onboarding: {
    save: '/api/onboarding',
  },
} as const;

/** Auth endpoints never get a Bearer token attached and never trigger a refresh retry. */
export const PUBLIC_AUTH_PATHS: readonly string[] = Object.values(API_ENDPOINTS.auth);
