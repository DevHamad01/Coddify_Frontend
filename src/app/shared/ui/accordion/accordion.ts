import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChildren,
} from '@angular/core';

import { Icon } from '../icon/icon';

export interface AccordionItem {
  readonly question: string;
  readonly answer: string;
}

let nextId = 0;

/**
 * Single-open accordion following the WAI-ARIA pattern: headers are buttons with
 * aria-expanded/aria-controls; ArrowUp/ArrowDown/Home/End move focus between headers.
 */
@Component({
  selector: 'app-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'flex flex-col gap-3' },
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion {
  readonly items = input.required<readonly AccordionItem[]>();

  protected readonly baseId = `app-accordion-${nextId++}`;
  protected readonly open = signal<number | null>(null);
  private readonly headers = viewChildren<ElementRef<HTMLButtonElement>>('header');

  protected toggle(index: number): void {
    this.open.update((current) => (current === index ? null : index));
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const headers = this.headers();
    const last = headers.length - 1;
    const target: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = target[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    headers[next]?.nativeElement.focus();
  }
}
