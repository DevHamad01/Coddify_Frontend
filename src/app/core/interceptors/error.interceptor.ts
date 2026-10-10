import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { toApiError } from '../api/api-error';

/** Outermost interceptor: every HTTP failure reaches callers as a typed `ApiError`. */
export const errorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(catchError((error: unknown) => throwError(() => toApiError(error))));
