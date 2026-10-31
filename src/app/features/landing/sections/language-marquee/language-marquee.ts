import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECHS } from '../../../../shared/data/tech';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';

/** Number of copies of the language list in the track; must be even for a seamless -50% loop. */
const COPIES = 2;

/**
 * Infinite horizontal strip of course chips with official logos. Pauses on hover/focus; stops under reduced motion.
 * Only the first copy is exposed to assistive tech and keyboard users.
 */
@Component({
  selector: 'app-language-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TechLogo],
  host: {
    id: 'languages',
    class: 'block scroll-mt-16 border-y border-border bg-surface py-5',
  },
  templateUrl: './language-marquee.html',
  styleUrl: './language-marquee.scss',
})
export class LanguageMarquee {
  protected readonly techs = TECHS;
  protected readonly copies = Array.from({ length: COPIES }, (_, i) => i);
}
