import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TechId, findTech } from '../../data/tech';

/**
 * Official technology logo (devicon SVG from `public/icons/tech`).
 * Decorative by default; pass `label` when the logo is the only thing naming the tech.
 */
@Component({
  selector: 'app-tech-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0 items-center justify-center' },
  templateUrl: './tech-logo.html',
  styleUrl: './tech-logo.scss',
})
export class TechLogo {
  readonly tech = input.required<TechId>();
  readonly size = input<number>(24);
  readonly label = input<string>('');

  protected readonly src = computed(() => `icons/tech/${this.tech()}.svg`);
  protected readonly invert = computed(() => findTech(this.tech()).invertOnDark ?? false);
}
