import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChildren } from '@angular/core';

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
  template: `
    @for (item of items(); track item.question; let i = $index) {
      <div
        class="rounded-card border bg-surface transition-colors duration-hover"
        [class.border-primary]="open() === i"
        [class.border-border]="open() !== i"
      >
        <h3 class="m-0">
          <button
            #header
            type="button"
            class="flex w-full items-center justify-between gap-4 rounded-card px-5 py-4 text-left font-display text-base font-semibold text-text"
            [id]="baseId + '-h' + i"
            [attr.aria-expanded]="open() === i"
            [attr.aria-controls]="baseId + '-p' + i"
            (click)="toggle(i)"
            (keydown)="onKeydown($event, i)"
          >
            {{ item.question }}
            <app-icon
              name="chevron-down"
              class="text-muted transition-transform duration-panel"
              [class.rotate-180]="open() === i"
            />
          </button>
        </h3>
        <div
          role="region"
          class="grid transition-[grid-template-rows] duration-panel ease-out"
          [class]="open() === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          [id]="baseId + '-p' + i"
          [attr.aria-labelledby]="baseId + '-h' + i"
          [attr.inert]="open() === i ? null : ''"
        >
          <div class="overflow-hidden">
            <p class="px-5 pb-5 text-[15px] leading-7 text-muted">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    }
  `,
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
