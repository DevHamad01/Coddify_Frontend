import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

/** The .NET API wraps every answer as { responseCode, code, responseMessage, data, errors }. */
interface ResponseEnvelope {
  readonly responseCode: number;
  readonly data: unknown;
}

function isEnvelope(body: unknown): body is ResponseEnvelope {
  return typeof body === 'object' && body !== null && 'responseCode' in body && 'data' in body;
}

/**
 * Unwraps successful API responses to their `data`, so every Http*Api keeps returning the plain
 * models the screens already use. Error envelopes are read by `toApiError`.
 */
export const envelopeInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    map((event) =>
      event instanceof HttpResponse && isEnvelope(event.body)
        ? event.clone({ body: event.body.data })
        : event,
    ),
  );
