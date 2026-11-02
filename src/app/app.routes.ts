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
        path: 'blog',
        title: 'Blog | Coddify',
        loadComponent: () =>
          import('./features/blog/blog-list/blog-list').then((m) => m.BlogList),
      },
      {
        path: 'about',
        title: 'About | Coddify',
        loadComponent: () => import('./features/about/about').then((m) => m.About),
      },
      {
        path: 'contact',
        title: 'Contact | Coddify',
        loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'privacy',
        title: 'Privacy Policy | Coddify',
        loadComponent: () => import('./features/legal/privacy/privacy').then((m) => m.Privacy),
      },
      {
        path: 'terms',
        title: 'Terms of Use | Coddify',
        loadComponent: () => import('./features/legal/terms/terms').then((m) => m.Terms),
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
        // Open to guests too: they answer first and create an account at the end.
        canActivate: [onboardingPendingGuard],
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
        path: 'journey/syllabus',
        title: 'Syllabus | Coddify',
        loadComponent: () => import('./features/syllabus/syllabus').then((m) => m.Syllabus),
      },
      {
        path: 'journeys',
        title: 'Journeys | Coddify',
        loadComponent: () => import('./features/journeys/journeys').then((m) => m.Journeys),
      },
      {
        path: 'streak',
        title: 'Streak | Coddify',
        loadComponent: () => import('./features/streak/streak').then((m) => m.Streak),
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
        path: 'profile/edit',
        title: 'Edit profile | Coddify',
        loadComponent: () =>
          import('./features/profile/edit-profile/edit-profile').then((m) => m.EditProfile),
      },
      {
        path: 'profile/collection',
        title: 'Collection | Coddify',
        loadComponent: () =>
          import('./features/profile/collection/collection').then((m) => m.Collection),
      },
      {
        path: 'profile/levels',
        title: 'Levels | Coddify',
        loadComponent: () => import('./features/profile/levels/levels').then((m) => m.Levels),
      },
      {
        // Notifications, preferences... linked from the profile menu.
        path: 'profile/:slug',
        title: 'Profile | Coddify',
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
  {
    // Full-screen workspace for interview problems and challenges.
    path: 'practice/problem/:id',
    title: 'Problem | Coddify',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/problem/problem').then((m) => m.Problem),
  },
  { path: '**', redirectTo: '' },
];
