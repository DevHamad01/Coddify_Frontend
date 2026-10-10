import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { toApiError } from '../../../core/api/api-error';
import { AuthService } from '../../../core/auth/auth.service';
import { Button } from '../../../shared/ui/button/button';
import { ToastService } from '../../../shared/ui/toast/toast.service';

/**
 * "Continue with Google". Uses a neutral monochrome G mark; swap in Google's official
 * button artwork (per their branding guidelines) before going to production.
 */
@Component({
  selector: 'app-google-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <button appButton type="button" variant="secondary" [block]="true" [loading]="pending()" (click)="signIn()">
      @if (!pending()) {
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full border border-border font-display text-sm font-extrabold"
          aria-hidden="true"
          >G</span
        >
      }
      {{ label() }}
    </button>
  `,
})
export class GoogleButton {
  readonly label = input<string>('Continue with Google');
  readonly returnUrl = input<string | null>(null);

  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly pending = signal(false);

  protected signIn(): void {
    this.pending.set(true);
    this.auth
      .loginWithGoogle()
      .pipe(
        finalize(() => this.pending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => void this.auth.navigateAfterLogin(this.returnUrl()),
        error: (error: unknown) => {
          const apiError = toApiError(error);
          if (apiError.code === 'google_not_configured') {
            this.toast.info('Google sign-in not configured');
          } else if (apiError.code !== 'google_cancelled') {
            this.toast.error(apiError.message);
          }
        },
      });
  }
}
