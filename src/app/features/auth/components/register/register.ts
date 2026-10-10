import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, toApiError } from '../../../../core/api/api-error';
import { RegisterResponse } from '../../../../core/auth/auth.models';
import { AuthService } from '../../../../core/auth/auth.service';
import { EMAIL_MESSAGES, ErrorMessages, fieldError } from '../../../../shared/forms/field-error';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { Checkbox } from '../../../../shared/ui/checkbox/checkbox';
import { Input } from '../../../../shared/ui/input/input';
import { AuthShell } from '../auth-shell/auth-shell';
import { CheckInbox } from '../check-inbox';
import { GoogleButton } from '../google-button';
import { PasswordStrengthMeter } from '../password-strength-meter';
import { matchFieldsValidator, strongPasswordValidator } from '../../utils/password-strength';

type Field = 'fullName' | 'email' | 'password' | 'confirmPassword' | 'terms';

const MESSAGES: Record<Field, ErrorMessages> = {
  fullName: { required: 'Tell us your name.', minlength: 'Name should be at least 2 characters.' },
  email: EMAIL_MESSAGES,
  password: {
    required: 'Choose a password.',
    weakPassword: 'Use 8+ characters with upper and lower case letters and a number.',
  },
  confirmPassword: { required: 'Type your password again.' },
  terms: { required: 'Please accept the terms to continue.' },
};

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Alert,
    Button,
    Checkbox,
    Input,
    AuthShell,
    CheckInbox,
    GoogleButton,
    PasswordStrengthMeter,
  ],
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );
  protected readonly password = toSignal(this.form.controls.password.valueChanges, {
    initialValue: '',
  });
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly serverError = signal<ApiError | null>(null);
  protected readonly registered = signal<RegisterResponse | null>(null);

  protected error(field: Field): string | null {
    const own = fieldError(this.form.controls[field], MESSAGES[field], this.submitted());
    if (own || field !== 'confirmPassword') {
      return own;
    }
    const confirm = this.form.controls.confirmPassword;
    const show = confirm.touched || this.submitted();
    return show && this.form.hasError('passwordMismatch') ? 'Passwords do not match.' : null;
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, email, password } = this.form.getRawValue();
    this.pending.set(true);
    this.auth
      .register({ fullName: fullName.trim(), email: email.trim(), password })
      .pipe(
        finalize(() => this.pending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => this.registered.set(response),
        error: (error: unknown) => this.serverError.set(toApiError(error)),
      });
  }
}
