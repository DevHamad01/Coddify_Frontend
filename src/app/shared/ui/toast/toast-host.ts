import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { ToastService, ToastTone } from './toast.service';

const TONE: Record<ToastTone, { icon: IconName; color: string }> = {
  success: { icon: 'check-circle', color: 'text-success' },
  error: { icon: 'alert-circle', color: 'text-danger' },
  info: { icon: 'info', color: 'text-info' },
};

@Component({
  selector: 'app-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class:
      'pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end',
    'aria-live': 'polite',
    'aria-atomic': 'false',
  },
  template: `
    @for (toast of toasts(); track toast.id) {
      <div
        class="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-card border border-border bg-surface p-4 shadow-modal"
        [attr.role]="toast.tone === 'error' ? 'alert' : 'status'"
      >
        <app-icon [name]="tone[toast.tone].icon" [class]="tone[toast.tone].color" />
        <p class="flex-1 text-sm font-medium text-text">{{ toast.message }}</p>
        <button
          type="button"
          class="-m-1 rounded-md p-1 text-muted hover:bg-surface-2 hover:text-text"
          aria-label="Dismiss notification"
          (click)="dismiss(toast.id)"
        >
          <app-icon name="x" [size]="16" />
        </button>
      </div>
    }
  `,
})
export class ToastHost {
  private readonly service = inject(ToastService);
  protected readonly toasts = this.service.toasts;
  protected readonly tone = TONE;

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
