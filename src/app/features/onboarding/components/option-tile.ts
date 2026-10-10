import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { findLanguage, LanguageId } from '../../../shared/data/languages';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconName } from '../../../shared/ui/icon/icons';
import { LanguageBadge } from '../../../shared/ui/language-badge/language-badge';

/**
 * Large selectable tile used as a radio option. Applied to a native button so it is
 * focusable and clickable; the parent radiogroup handles arrow keys.
 */
@Component({
  selector: 'button[appOptionTile]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, LanguageBadge],
  host: {
    type: 'button',
    role: 'radio',
    class:
      'press-tile flex w-full items-center gap-4 px-4 py-3.5 transition-transform duration-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    '[attr.aria-checked]': 'selected()',
    '[tabIndex]': 'focusable() ? 0 : -1',
  },
  template: `
    <span
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      [class]="selected() ? 'bg-primary/15 text-primary' : 'bg-surface-2 text-muted'"
    >
      @if (language(); as lang) {
        <app-language-badge [language]="lang" [size]="34" />
      } @else if (icon(); as name) {
        <app-icon [name]="name" [size]="22" />
      }
    </span>
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="font-display text-base font-bold text-text">{{ label() }}</span>
      @if (description()) {
        <span class="text-sm text-muted">{{ description() }}</span>
      }
    </span>
    <kbd
      class="hidden h-6 min-w-6 items-center justify-center rounded-md border border-border px-1.5 text-xs text-muted sm:flex"
      aria-hidden="true"
      >{{ shortcut() }}</kbd
    >
  `,
})
export class OptionTile {
  readonly label = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<IconName | null>(null);
  readonly languageId = input<LanguageId | null>(null);
  readonly selected = input<boolean>(false);
  /** Roving tabindex: only the selected (or first) tile is in the tab order. */
  readonly focusable = input<boolean>(false);
  readonly shortcut = input<number>(1);

  protected readonly language = computed(() => {
    const id = this.languageId();
    return id ? findLanguage(id) : null;
  });
}
