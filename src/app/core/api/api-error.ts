import { HttpErrorResponse } from '@angular/common/http';

/** Stable error codes the UI can branch on. Unknown server codes fall back to 'unknown'. */
export type ApiErrorCode =
  | 'email_taken'
  | 'invalid_credentials'
  | 'email_not_verified'
  | 'invalid_token'
  | 'token_expired'
  | 'user_not_found'
  | 'validation'
  | 'unauthorized'
  | 'network'
  | 'google_not_configured'
  | 'google_cancelled'
  | 'unknown';

const KNOWN_CODES: readonly ApiErrorCode[] = [
  'email_taken',
  'invalid_credentials',
  'email_not_verified',
  'invalid_token',
  'token_expired',
  'user_not_found',
  'validation',
  'unauthorized',
  'network',
  'google_not_configured',
  'google_cancelled',
];

export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly status = 0,
    /** Field-level messages, e.g. { email: ['Email already registered'] }. */
    readonly fieldErrors: Readonly<Record<string, readonly string[]>> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Shape we accept from the backend: ASP.NET ProblemDetails plus an optional `code`. */
interface ProblemBody {
  readonly code?: unknown;
  readonly message?: unknown;
  readonly title?: unknown;
  readonly detail?: unknown;
  readonly errors?: unknown;
}

const FALLBACK_BY_STATUS: Partial<Record<number, [ApiErrorCode, string]>> = {
  0: ['network', 'Cannot reach the server. Check your connection and try again.'],
  400: ['validation', 'Some details look off. Please check the form.'],
  401: ['unauthorized', 'Your session has expired. Please log in again.'],
  404: ['user_not_found', 'We could not find that account.'],
};

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError('unknown', 'Something went wrong. Please try again.');
  }
  const body: ProblemBody =
    typeof error.error === 'object' && error.error !== null ? error.error : {};
  const [fallbackCode, fallbackMessage] = FALLBACK_BY_STATUS[error.status] ?? [
    'unknown',
    'Something went wrong on our side. Please try again in a moment.',
  ];
  const code = KNOWN_CODES.find((known) => known === body.code) ?? fallbackCode;
  const message = firstString(body.message, body.detail, body.title) ?? fallbackMessage;
  return new ApiError(code, message, error.status, readFieldErrors(body.errors));
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === 'string' && value.length > 0);
}

function readFieldErrors(errors: unknown): Record<string, readonly string[]> {
  if (typeof errors !== 'object' || errors === null) {
    return {};
  }
  const result: Record<string, readonly string[]> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      // ProblemDetails uses PascalCase keys ("Email"); forms use camelCase.
      const field = key.charAt(0).toLowerCase() + key.slice(1);
      result[field] = value.filter((item): item is string => typeof item === 'string');
    }
  }
  return result;
}
