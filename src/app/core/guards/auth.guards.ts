import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

/** Signed-in users only; others go to /login?returnUrl=<where they were heading>. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Login/register pages: signed-in users are sent to the app. */
export const guestGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated() ? inject(Router).parseUrl('/app') : true;

/** App pages: users who have not finished onboarding are sent to /onboarding. */
export const onboardingGuard: CanActivateFn = () => {
  const user = inject(AuthService).user();
  return user && !user.onboardingCompleted ? inject(Router).parseUrl('/onboarding') : true;
};

/** The onboarding flow itself: users who already finished it go straight to the app. */
export const onboardingPendingGuard: CanActivateFn = () =>
  inject(AuthService).user()?.onboardingCompleted ? inject(Router).parseUrl('/app') : true;
