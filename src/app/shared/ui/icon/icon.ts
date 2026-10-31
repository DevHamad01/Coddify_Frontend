import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ICONS, IconName } from './icons';

/**
 * Inline SVG icon. Decorative by default (aria-hidden); pass `label` when the icon
 * is the only content of an interactive element and has meaning on its own.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(2);
  readonly filled = input<boolean>(false);
  readonly label = input<string>('');

  protected readonly paths = computed(() => ICONS[this.name()]);
}
