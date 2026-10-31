import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, toApiError } from '../../../../core/api/api-error';
import { AuthService } from '../../../../core/auth/auth.service';
import { EMAIL_MESSAGES, fieldError } from '../../../../shared/forms/field-error';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { Checkbox } from '../../../../shared/ui/checkbox/checkbox';
import { Input } from '../../../../shared/ui/input/input';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { AuthShell } from '../auth-shell/auth-shell';
import { GoogleButton } from '../google-button/google-button';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Alert,
    Button,
    Checkbox,
    Input,
    AuthShell,
    GoogleButton,
  ],
  templateUrl: './login.html',
})
export class Login {
  /** Bound from the `?returnUrl=` query param (router component input binding). */
  readonly returnUrl = input<string | null>(null);

  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly serverError = signal<ApiError | null>(null);
  protected readonly resending = signal(false);

  protected error(field: 'email' | 'password'): string | null {
    const messages = field === 'email' ? EMAIL_MESSAGES : { required: 'Enter your password.' };
    return fieldError(this.form.controls[field], messages, this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password, remember } = this.form.getRawValue();
    this.pending.set(true);
    this.auth
      .login({ email: email.trim(), password }, remember)
      .pipe(
        finalize(() => this.pending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => void this.auth.navigateAfterLogin(this.returnUrl()),
        error: (error: unknown) => this.serverError.set(toApiError(error)),
      });
  }

  protected resendVerification(): void {
    this.resending.set(true);
    this.auth
      .resendVerification(this.form.controls.email.value.trim())
      .pipe(
        finalize(() => this.resending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.toast.success('Verification email sent. Check your inbox.'),
        error: (error: unknown) => this.toast.error(toApiError(error).message),
      });
  }
}
