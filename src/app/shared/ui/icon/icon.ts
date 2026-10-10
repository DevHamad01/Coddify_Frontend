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
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      [attr.aria-hidden]="label() ? null : 'true'"
      focusable="false"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(2);
  readonly filled = input<boolean>(false);
  readonly label = input<string>('');

  protected readonly paths = computed(() => ICONS[this.name()]);
}
