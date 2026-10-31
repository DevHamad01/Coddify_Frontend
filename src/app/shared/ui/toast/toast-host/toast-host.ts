import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Icon } from '../../icon/icon';
import { IconName } from '../../icon/icons';
import { ToastService, ToastTone } from '../toast.service';

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
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.scss',
})
export class ToastHost {
  private readonly service = inject(ToastService);
  protected readonly toasts = this.service.toasts;
  protected readonly tone = TONE;

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
