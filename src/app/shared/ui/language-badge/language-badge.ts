import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Language } from '../../data/languages';
import { TechLogo } from '../tech-logo/tech-logo';

/** Official logo of one of the launch languages (language ids match the logo file names). */
@Component({
  selector: 'app-language-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechLogo],
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  templateUrl: './language-badge.html',
  styleUrl: './language-badge.scss',
})
export class LanguageBadge {
  readonly language = input.required<Language>();
  readonly size = input<number>(32);
}
