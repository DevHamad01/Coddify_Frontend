import { AbstractControl } from '@angular/forms';

/** Validator key → message. The first matching key wins, so order by priority. */
export type ErrorMessages = Readonly<Record<string, string>>;

export const EMAIL_MESSAGES: ErrorMessages = {
  required: 'Enter your email address.',
  email: 'Enter a valid email, like name@example.com.',
};

/**
 * Message for the first failing validator, shown only after the user has left the
 * field (touched) or tried to submit. Returns null when there is nothing to show.
 */
export function fieldError(
  control: AbstractControl | null,
  messages: ErrorMessages,
  submitted: boolean,
): string | null {
  if (!control || control.valid || !(control.touched || submitted)) {
    return null;
  }
  const key = Object.keys(messages).find((name) => control.hasError(name));
  return key ? messages[key] : null;
}
