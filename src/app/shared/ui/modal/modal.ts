import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon } from '../icon/icon';

let nextId = 0;

/**
 * Centered dialog with a backdrop, title, close button, body and an optional `[footer]` slot.
 * Escape and the backdrop close it: `<app-modal heading="…" (closed)="open.set(false)">…</app-modal>`.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '(document:keydown.escape)': 'closed.emit()' },
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  readonly heading = input.required<string>();
  readonly subheading = input<string>('');
  readonly width = input<'sm' | 'md' | 'lg'>('md');
  readonly closed = output<void>();

  protected readonly headingId = `modal-heading-${nextId++}`;
}
