import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, toApiError } from '../../../../core/api/api-error';
import { AuthService } from '../../../../core/auth/auth.service';
import { EMAIL_MESSAGES, fieldError } from '../../../../shared/forms/field-error';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { Input } from '../../../../shared/ui/input/input';
import { AuthShell } from '../auth-shell/auth-shell';
import { CheckInbox } from '../check-inbox/check-inbox';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, Input, AuthShell, CheckInbox],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  protected readonly submitted = signal(false);
  protected readonly pending = signal(false);
  protected readonly serverError = signal<ApiError | null>(null);
  protected readonly sent = signal<{ email: string; token: string | null } | null>(null);

  protected emailError(): string | null {
    return fieldError(this.form.controls.email, EMAIL_MESSAGES, this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.controls.email.value.trim();
    this.pending.set(true);
    this.auth
      .forgotPassword(email)
      .pipe(
        finalize(() => this.pending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => this.sent.set({ email, token: response.debugResetToken ?? null }),
        error: (error: unknown) => this.serverError.set(toApiError(error)),
      });
  }
}
