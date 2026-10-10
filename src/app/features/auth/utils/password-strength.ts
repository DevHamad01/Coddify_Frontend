import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PASSWORD_MIN_LENGTH = 8;

export interface PasswordChecks {
  readonly minLength: boolean;
  readonly upper: boolean;
  readonly lower: boolean;
  readonly number: boolean;
}

export type StrengthLabel = '' | 'Too weak' | 'Weak' | 'Almost there' | 'Strong';

export interface PasswordStrength {
  readonly checks: PasswordChecks;
  /** Number of satisfied rules, 0–4. */
  readonly score: number;
  readonly label: StrengthLabel;
  /** True only when every rule passes. */
  readonly isValid: boolean;
}

const LABELS: readonly StrengthLabel[] = ['', 'Too weak', 'Weak', 'Almost there', 'Strong'];

/** Rules: at least 8 characters, one uppercase, one lowercase and one number. */
export function evaluatePassword(password: string): PasswordStrength {
  const checks: PasswordChecks = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score, label: password ? LABELS[score] : '', isValid: score === 4 };
}

/** Control validator → `{ weakPassword: true }` unless every rule passes. */
export const strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: unknown = control.value;
  return typeof value === 'string' && evaluatePassword(value).isValid ? null : { weakPassword: true };
};

/** Group validator → `{ passwordMismatch: true }` when the two fields differ (once confirm is filled). */
export function matchFieldsValidator(field: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const value: unknown = group.get(field)?.value;
    const confirm: unknown = group.get(confirmField)?.value;
    return confirm && value !== confirm ? { passwordMismatch: true } : null;
  };
}
