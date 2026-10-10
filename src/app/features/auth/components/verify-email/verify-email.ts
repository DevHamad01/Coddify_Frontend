import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { toApiError } from '../../../../core/api/api-error';
import { AuthService } from '../../../../core/auth/auth.service';
import { Alert } from '../../../../shared/ui/alert/alert';
import { Button } from '../../../../shared/ui/button/button';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Cooldown } from '../../utils/cooldown';
import { AuthShell } from '../auth-shell/auth-shell';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Alert, Button, Spinner, AuthShell],
  template: `
    @switch (state()) {
      @case ('loading') {
        <app-auth-shell heading="Verifying your email" pose="thinking" panelHeading="One moment...">
          <div class="flex flex-col items-center gap-4 py-6 text-muted">
            <app-spinner [size]="36" label="Verifying your email" class="text-primary" />
            <p>Checking your link, this only takes a second.</p>
          </div>
        </app-auth-shell>
      }
      @case ('success') {
        <app-auth-shell heading="Email verified!" pose="celebrating" panelHeading="Welcome to Coddify">
          <div class="flex flex-col gap-5">
            <app-alert tone="success" message="Your email is confirmed. Your account is ready." />
            <a appButton [routerLink]="auth.isAuthenticated() ? auth.homeRoute() : '/login'" [block]="true">
              {{ auth.isAuthenticated() ? 'Continue' : 'Log in to start learning' }}
            </a>
          </div>
        </app-auth-shell>
      }
      @case ('error') {
        <app-auth-shell heading="We could not verify your email" pose="thinking" panelHeading="Let's fix that">
          <div class="flex flex-col gap-5">
            <app-alert [message]="errorMessage()" />
            @if (email()) {
              <button
                appButton
                type="button"
                [block]="true"
                [loading]="sending()"
                [disabled]="cooldown.active()"
                (click)="resend()"
              >
                {{ cooldown.active() ? 'Resend in ' + cooldown.remaining() + 's' : 'Send a new link' }}
              </button>
            } @else {
              <p class="text-sm text-muted">Log in with your email and we will offer to send a fresh verification link.</p>
            }
            <a appButton variant="secondary" routerLink="/login" [block]="true">Back to log in</a>
          </div>
        </app-auth-shell>
      }
    }
  `,
})
export class VerifyEmail implements OnInit {
  /** From the emailed link: /verify-email?email=...&token=... */
  readonly token = input<string | null>(null);
  readonly email = input<string | null>(null);

  protected readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<VerifyState>('loading');
  protected readonly errorMessage = signal('');
  protected readonly sending = signal(false);
  protected readonly cooldown = new Cooldown(this.destroyRef);

  ngOnInit(): void {
    const token = this.token();
    const email = this.email();
    if (!token || !email) {
      this.fail('This verification link is incomplete. Open the latest email from us, or request a new link.');
      return;
    }
    this.auth
      .verifyEmail({ email, token })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.state.set('success'),
        error: (error: unknown) => this.fail(toApiError(error).message),
      });
  }

  protected resend(): void {
    const email = this.email();
    if (!email) {
      return;
    }
    this.sending.set(true);
    this.auth
      .resendVerification(email)
      .pipe(
        finalize(() => this.sending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.cooldown.start(60);
          this.toast.success('A new verification link is on its way.');
        },
        error: (error: unknown) => this.toast.error(toApiError(error).message),
      });
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.state.set('error');
  }
}
