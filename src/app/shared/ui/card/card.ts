import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING: Record<CardPadding, string> = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-6 sm:p-8' };

/** Flat surface with a 1px border and 16px radius. `interactive` adds a hover lift for clickable cards. */
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class Card {
  readonly padding = input<CardPadding>('md');
  readonly interactive = input<boolean>(false);

  protected readonly classes = computed(() =>
    [
      'block rounded-card border border-border bg-surface',
      PADDING[this.padding()],
      this.interactive()
        ? 'transition-[transform,border-color] duration-hover hover:-translate-y-0.5 hover:border-primary/60'
        : '',
    ].join(' '),
  );
}
