import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Language } from '../../data/languages';

/** Coloured letter badge used instead of third-party language logos. */
@Component({
  selector: 'app-language-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex shrink-0 items-center justify-center rounded-[28%] font-mono font-bold leading-none',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'fontSize()',
    '[style.background]': 'language().color',
    '[style.color]': 'language().badgeText',
    'aria-hidden': 'true',
  },
  template: `{{ language().badge }}`,
})
export class LanguageBadge {
  readonly language = input.required<Language>();
  readonly size = input<number>(32);

  protected readonly fontSize = computed(() =>
    Math.round(this.size() * (this.language().badge.length > 2 ? 0.3 : 0.38)),
  );
}
