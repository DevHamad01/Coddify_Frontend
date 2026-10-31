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
  learning: {
    journey: (courseId: string) => `/api/courses/${courseId}/journey`,
    lesson: (lessonId: string) => `/api/lessons/${lessonId}`,
    run: (lessonId: string) => `/api/lessons/${lessonId}/run`,
    complete: (lessonId: string) => `/api/lessons/${lessonId}/complete`,
    submissions: (lessonId: string) => `/api/lessons/${lessonId}/submissions`,
    claimChest: (nodeId: string) => `/api/journey/chests/${nodeId}/claim`,
    syllabus: (courseId: string) => `/api/courses/${courseId}/syllabus`,
    myCourses: '/api/me/courses',
    startCourse: (courseId: string) => `/api/me/courses/${courseId}/start`,
  },
  gamification: {
    stats: '/api/me/stats',
    dailyGoal: '/api/me/daily-goal',
    streak: '/api/me/streak',
    missions: '/api/me/missions',
    leaderboard: (scope: string) => `/api/leaderboard/${scope}`,
    store: (tab: string) => `/api/store/${tab}`,
    equip: (itemId: string) => `/api/store/items/${itemId}/equip`,
    profile: '/api/me/profile',
  },
  tutor: {
    chat: '/api/tutor/chat',
  },
  practice: {
    problems: '/api/interview/problems',
    today: '/api/interview/today',
    progress: '/api/interview/progress',
    interviewDate: '/api/interview/date',
    challenges: '/api/challenges',
    problem: (id: string) => `/api/problems/${id}`,
    run: (id: string) => `/api/problems/${id}/run`,
    submit: (id: string) => `/api/problems/${id}/submit`,
    submissions: (id: string) => `/api/problems/${id}/submissions`,
  },
} as const;

/** Auth endpoints never get a Bearer token attached and never trigger a refresh retry. */
export const PUBLIC_AUTH_PATHS: readonly string[] = Object.values(API_ENDPOINTS.auth);
