import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';

import { toApiError } from '../../../../core/api/api-error';
import { AuthService } from '../../../../core/auth/auth.service';
import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Cooldown } from '../../utils/cooldown';

export type InboxKind = 'verify' | 'reset';

/**
 * "We emailed you" confirmation with a rate-limited resend button. When the mock API returns a
 * debug token, a clearly labelled demo link stands in for clicking the email.
 */
@Component({
  selector: 'app-check-inbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon],
  templateUrl: './check-inbox.html',
  styleUrl: './check-inbox.scss',
})
export class CheckInbox {
  readonly email = input.required<string>();
  readonly message = input.required<string>();
  readonly kind = input<InboxKind>('verify');
  readonly demoToken = input<string | null>(null);

  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cooldown = new Cooldown(this.destroyRef);
  protected readonly sending = signal(false);
  /** Latest demo token: starts from the input and is replaced after each resend. */
  private readonly token = linkedSignal(() => this.demoToken());

  protected readonly demoLink = computed(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    const path = this.kind() === 'verify' ? '/verify-email' : '/reset-password';
    return { path, params: { email: this.email(), token } };
  });

  constructor() {
    // The first email was just sent, so start the cooldown right away.
    this.cooldown.start();
  }

  protected resend(): void {
    this.sending.set(true);
    const request: Observable<string | undefined> =
      this.kind() === 'verify'
        ? this.auth.resendVerification(this.email()).pipe(map((r) => r.debugVerificationToken))
        : this.auth.forgotPassword(this.email()).pipe(map((r) => r.debugResetToken));
    request
      .pipe(
        finalize(() => this.sending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (token) => {
          this.token.set(token ?? this.token());
          this.cooldown.start();
          this.toast.success('Email sent again. Check your inbox.');
        },
        error: (error: unknown) => this.toast.error(toApiError(error).message),
      });
  }
}
