import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export type AlertTone = 'error' | 'success' | 'info';

const TONES: Record<AlertTone, { icon: IconName; classes: string }> = {
  error: { icon: 'alert-circle', classes: 'border-danger/40 bg-danger/10 text-danger' },
  success: { icon: 'check-circle', classes: 'border-success/40 bg-success/10 text-success' },
  info: { icon: 'info', classes: 'border-info/40 bg-info/10 text-info' },
};

/** Inline banner for form-level messages (server errors, confirmations). Extra actions are projected. */
@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    '[class]': '"flex gap-3 rounded-input border p-3.5 text-sm " + styles().classes',
    '[attr.role]': 'tone() === "error" ? "alert" : "status"',
  },
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  readonly message = input.required<string>();
  readonly tone = input<AlertTone>('error');

  protected readonly styles = computed(() => TONES[this.tone()]);
}
