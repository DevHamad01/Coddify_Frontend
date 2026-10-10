import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, toApiError } from '../../../../core/api/api-error';
import { AuthService } from '../../../../core/auth/auth.service';
import { fieldError } from '../../../../shared/forms/field-error';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { Input } from '../../../../shared/ui/input/input';
import { matchFieldsValidator, strongPasswordValidator } from '../../utils/password-strength';
import { AuthShell } from '../auth-shell/auth-shell';
import { PasswordStrengthMeter } from '../password-strength-meter';

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, Input, AuthShell, PasswordStrengthMeter],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  /** Both come from the emailed link: /reset-password?email=...&token=... */
  readonly token = input<string | null>(null);
  readonly email = input<string | null>(null);

  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly linkIsValid = computed(() => !!this.token() && !!this.email());
  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );
  protected readonly password = toSignal(this.form.controls.password.valueChanges, { initialValue: '' });
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly serverError = signal<ApiError | null>(null);
  protected readonly done = signal(false);

  protected passwordError(): string | null {
    return fieldError(
      this.form.controls.password,
      { required: 'Choose a new password.', weakPassword: 'Use 8+ characters with upper and lower case letters and a number.' },
      this.submitted(),
    );
  }

  protected confirmError(): string | null {
    const control = this.form.controls.confirmPassword;
    const own = fieldError(control, { required: 'Type your new password again.' }, this.submitted());
    const show = control.touched || this.submitted();
    return own ?? (show && this.form.hasError('passwordMismatch') ? 'Passwords do not match.' : null);
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);
    const token = this.token();
    const email = this.email();
    if (this.form.invalid || !token || !email) {
      this.form.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    this.auth
      .resetPassword({ email, token, newPassword: this.form.controls.password.value })
      .pipe(
        finalize(() => this.pending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.done.set(true),
        error: (error: unknown) => this.serverError.set(toApiError(error)),
      });
  }
}
