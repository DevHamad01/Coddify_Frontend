import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECHS } from '../../../../shared/data/tech';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';

/** Number of copies of the language list in the track; must be even for a seamless -50% loop. */
const COPIES = 2;

/**
 * Two infinite strips of course chips with official logos, scrolling in opposite directions.
 * Pauses on hover/focus; stops under reduced motion. Only the first copy is exposed to
 * assistive tech and keyboard users.
 */
@Component({
  selector: 'app-language-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TechLogo],
  host: {
    id: 'languages',
    class: 'flex flex-col gap-3 scroll-mt-16 border-y border-border bg-surface py-5',
  },
  templateUrl: './language-marquee.html',
  styleUrl: './language-marquee.scss',
})
export class LanguageMarquee {
  private readonly half = Math.ceil(TECHS.length / 2);
  protected readonly rows = [
    { techs: TECHS.slice(0, this.half), reverse: false },
    { techs: TECHS.slice(this.half), reverse: true },
  ];
  protected readonly copies = Array.from({ length: COPIES }, (_, i) => i);
}
