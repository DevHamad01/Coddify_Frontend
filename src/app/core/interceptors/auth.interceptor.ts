import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { PUBLIC_AUTH_PATHS } from '../api/api-endpoints';
import { AuthService } from '../auth/auth.service';
import { APP_ENV } from '../config/environment';

/**
 * Attaches `Authorization: Bearer` to calls to our API. On a 401 it refreshes the token once
 * and retries; if the refresh fails the user is logged out and sent to /login.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const { apiBaseUrl } = inject(APP_ENV);

  const isOurApi = request.url.startsWith(apiBaseUrl);
  const isAuthCall = PUBLIC_AUTH_PATHS.some((path) => request.url.endsWith(path));
  if (!isOurApi || isAuthCall) {
    return next(request);
  }

  const token = auth.accessToken();
  return next(token ? withToken(request, token) : request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || !token) {
        return throwError(() => error);
      }
      return auth.refreshAccessToken().pipe(
        catchError((refreshError: unknown) => {
          auth.logout('/login');
          return throwError(() => refreshError);
        }),
        switchMap((fresh) => next(withToken(request, fresh))),
      );
    }),
  );
};

function withToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
