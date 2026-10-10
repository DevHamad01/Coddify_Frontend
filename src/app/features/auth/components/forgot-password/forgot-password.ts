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
import { CheckInbox } from '../check-inbox';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, Input, AuthShell, CheckInbox],
  template: `
    @if (sent(); as result) {
      <app-auth-shell heading="Check your inbox" pose="happy" panelHeading="Back in no time">
        <app-check-inbox
          kind="reset"
          [email]="result.email"
          [demoToken]="result.token"
          message="If an account exists, we sent a password reset link to"
        />
      </app-auth-shell>
    } @else {
      <app-auth-shell
        heading="Forgot your password?"
        subheading="No stress. Enter your email and we will send you a reset link."
        pose="thinking"
        panelHeading="Happens to the best of us"
      >
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
          @if (serverError(); as err) {
            <app-alert [message]="err.message" />
          }
          <app-input
            label="Email"
            type="email"
            icon="mail"
            autocomplete="email"
            placeholder="you@example.com"
            formControlName="email"
            [required]="true"
            [error]="emailError()"
          />
          <button appButton type="submit" [block]="true" [loading]="pending()" loadingLabel="Sending link">
            Send reset link
          </button>
        </form>
        <p class="mt-6 text-center text-sm text-muted">
          Remembered it?
          <a routerLink="/login" class="font-semibold text-primary hover:underline">Back to log in</a>
        </p>
      </app-auth-shell>
    }
  `,
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
