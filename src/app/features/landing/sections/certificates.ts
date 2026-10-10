import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../shared/ui/chip/chip';
import { Icon } from '../../../shared/ui/icon/icon';
import { LANGUAGES } from '../../../shared/data/languages';
import { LanguageBadge } from '../../../shared/ui/language-badge/language-badge';
import { FeatureSplit } from '../components/feature-split';

@Component({
  selector: 'app-certificates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, LanguageBadge, FeatureSplit],
  host: { id: 'certificates', class: 'block scroll-mt-16' },
  template: `
    <app-feature-split
      [band]="true"
      [reverse]="true"
      eyebrow="Certificates"
      heading="Finish a course and earn proof"
      lead="Every completed course comes with a certificate and a public verification link, ready for your CV, LinkedIn or your next internship application."
    >
      <ul copy class="flex flex-col gap-3 text-[15px] text-muted">
        @for (point of points; track point) {
          <li class="flex items-center gap-2.5">
            <app-icon name="check-circle" [size]="18" class="text-success" />{{ point }}
          </li>
        }
      </ul>

      <!-- Stacked paper certificate mock -->
      <div visual class="relative w-full max-w-sm py-4" aria-label="Example certificate" role="img">
        <div class="absolute inset-x-6 inset-y-6 rotate-[-6deg] rounded-card border border-border bg-surface-2"></div>
        <div class="absolute inset-x-4 inset-y-5 rotate-[-3deg] rounded-card border border-border bg-surface-2"></div>
        <div class="relative rounded-card border border-border bg-surface p-7 text-center shadow-modal">
          <span class="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-xp/70"></span>
          <span class="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-xp/70"></span>
          <span class="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-xp/70"></span>
          <span class="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-xp/70"></span>

          <app-icon name="award" [size]="36" class="text-xp" />
          <p class="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Certificate of completion</p>
          <p class="mt-5 text-sm italic text-muted">This certifies that</p>
          <p class="mx-auto mt-1 w-fit border-b-2 border-xp/40 px-4 pb-1 font-display text-2xl font-bold">Ayesha Khan</p>
          <p class="mt-3 text-sm italic text-muted">has successfully completed</p>
          <div class="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5">
            <app-language-badge [language]="python" [size]="22" />
            <span class="font-display text-sm font-bold">Python Foundations</span>
          </div>
          <div class="mt-7 flex items-end justify-between text-left">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-muted">Issued</p>
              <p class="text-sm font-semibold">Oct 2026</p>
            </div>
            <app-chip tone="primary" icon="check">Verified</app-chip>
          </div>
        </div>
      </div>
    </app-feature-split>
  `,
})
export class Certificates {
  protected readonly python = LANGUAGES[0];
  protected readonly points = [
    'Unique link anyone can verify',
    'Lists the skills and projects you completed',
    'Share to LinkedIn in one click',
  ];
}
