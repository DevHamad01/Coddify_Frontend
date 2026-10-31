import { Routes } from '@angular/router';

import {
  authGuard,
  guestGuard,
  onboardingGuard,
  onboardingPendingGuard,
} from './core/guards/auth.guards';
import { AppLayout } from './layouts/app-layout/app-layout';
import { MinimalLayout } from './layouts/minimal-layout/minimal-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

const comingSoon = () => import('./features/coming-soon/coming-soon').then((m) => m.ComingSoon);

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Coddify | Learn to code, one small win a day',
        loadComponent: () => import('./features/landing/landing/landing').then((m) => m.Landing),
      },
      {
        // Docs, playground, cheat sheets... linked from the Resources menu, built in later sprints.
        path: 'resources/:slug',
        title: 'Resources | Coddify',
        loadComponent: comingSoon,
      },
      {
        path: 'about',
        title: 'About | Coddify',
        data: { title: 'About Coddify' },
        loadComponent: comingSoon,
      },
      {
        path: 'contact',
        title: 'Contact | Coddify',
        data: { title: 'Contact us' },
        loadComponent: comingSoon,
      },
      {
        path: 'privacy',
        title: 'Privacy | Coddify',
        data: { title: 'Privacy policy' },
        loadComponent: comingSoon,
      },
      {
        path: 'terms',
        title: 'Terms | Coddify',
        data: { title: 'Terms of use' },
        loadComponent: comingSoon,
      },
    ],
  },
  {
    path: '',
    component: MinimalLayout,
    children: [
      {
        path: 'login',
        title: 'Log in | Coddify',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/components/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        title: 'Create your account | Coddify',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/components/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        title: 'Forgot password | Coddify',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/components/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword,
          ),
      },
      {
        path: 'reset-password',
        title: 'Reset password | Coddify',
        loadComponent: () =>
          import('./features/auth/components/reset-password/reset-password').then(
            (m) => m.ResetPassword,
          ),
      },
      {
        path: 'verify-email',
        title: 'Verify email | Coddify',
        loadComponent: () =>
          import('./features/auth/components/verify-email/verify-email').then((m) => m.VerifyEmail),
      },
      {
        path: 'onboarding',
        title: 'Get started | Coddify',
        canActivate: [authGuard, onboardingPendingGuard],
        loadComponent: () => import('./features/onboarding/onboarding').then((m) => m.Onboarding),
      },
    ],
  },
  {
    // Signed-in area: sidebar shell around every page except the full-screen lesson.
    path: 'app',
    component: AppLayout,
    canActivate: [authGuard, onboardingGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'journey' },
      {
        path: 'journey',
        title: 'Journey | Coddify',
        loadComponent: () => import('./features/journey/journey').then((m) => m.Journey),
      },
      {
        path: 'practice',
        title: 'Practice | Coddify',
        loadComponent: () => import('./features/practice/practice').then((m) => m.Practice),
      },
      {
        path: 'interview',
        title: 'Interview prep | Coddify',
        loadComponent: () => import('./features/interview/interview').then((m) => m.Interview),
      },
      {
        path: 'interview/problem/:slug',
        title: 'Problem | Coddify',
        data: { title: 'Problem workspace' },
        loadComponent: comingSoon,
      },
      {
        path: 'missions',
        title: 'Missions | Coddify',
        loadComponent: () => import('./features/missions/missions').then((m) => m.Missions),
      },
      {
        path: 'leaderboard',
        title: 'Leaderboard | Coddify',
        loadComponent: () =>
          import('./features/leaderboard/leaderboard').then((m) => m.Leaderboard),
      },
      {
        path: 'store',
        title: 'Store | Coddify',
        loadComponent: () => import('./features/store/store').then((m) => m.Store),
      },
      {
        path: 'profile',
        title: 'My Profile | Coddify',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
      {
        // Edit profile, notifications, preferences... linked from the profile menu.
        path: 'profile/:slug',
        title: 'Profile | Coddify',
        loadComponent: comingSoon,
      },
      {
        path: 'projects',
        title: 'Projects | Coddify',
        data: { title: 'Projects' },
        loadComponent: comingSoon,
      },
      {
        path: 'history',
        title: 'History | Coddify',
        data: { title: 'History' },
        loadComponent: comingSoon,
      },
      {
        path: '**',
        title: 'Coming soon | Coddify',
        data: { title: 'This screen' },
        loadComponent: comingSoon,
      },
    ],
  },
  {
    // Full-screen lesson, outside the sidebar shell.
    path: 'learn/:lessonId',
    title: 'Lesson | Coddify',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/lesson/lesson').then((m) => m.Lesson),
  },
  { path: '**', redirectTo: '' },
];
