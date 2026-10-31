import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LANGUAGES } from '../../../../shared/data/languages';
import { LanguageBadge } from '../../../../shared/ui/language-badge/language-badge';

/** Number of copies of the language list in the track; must be even for a seamless -50% loop. */
const COPIES = 6;

/**
 * Infinite horizontal strip of language chips. Pauses on hover/focus; stops under reduced motion.
 * Only the first copy is exposed to assistive tech and keyboard users.
 */
@Component({
  selector: 'app-language-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LanguageBadge],
  host: {
    id: 'languages',
    class: 'block scroll-mt-16 border-y border-border bg-surface-2/70 py-5',
  },
  templateUrl: './language-marquee.html',
  styleUrl: './language-marquee.scss',
})
export class LanguageMarquee {
  protected readonly languages = LANGUAGES;
  protected readonly copies = Array.from({ length: COPIES }, (_, i) => i);
}
