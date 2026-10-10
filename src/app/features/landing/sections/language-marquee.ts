import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LANGUAGES } from '../../../shared/data/languages';
import { LanguageBadge } from '../../../shared/ui/language-badge/language-badge';

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
  host: { id: 'languages', class: 'block scroll-mt-16 border-y border-border bg-surface-2/70 py-5' },
  template: `
    <h2 class="sr-only">Languages you can learn</h2>
    <div
      class="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <ul
        class="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
      >
        @for (copy of copies; track copy) {
          @for (language of languages; track language.id) {
            <li [attr.aria-hidden]="copy > 0 ? 'true' : null">
              <a
                routerLink="/register"
                [queryParams]="{ lang: language.id }"
                [tabIndex]="copy > 0 ? -1 : 0"
                class="flex h-12 items-center gap-2.5 rounded-btn border border-border bg-surface px-4 font-display text-[15px] font-bold text-text shadow-[0_3px_0_0_rgb(var(--c-border))] transition-colors duration-hover hover:border-primary/60"
              >
                <app-language-badge [language]="language" [size]="26" />
                {{ language.name }}
              </a>
            </li>
          }
        }
      </ul>
    </div>
  `,
})
export class LanguageMarquee {
  protected readonly languages = LANGUAGES;
  protected readonly copies = Array.from({ length: COPIES }, (_, i) => i);
}
