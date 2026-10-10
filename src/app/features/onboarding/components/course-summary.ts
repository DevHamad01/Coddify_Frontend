import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DailyMinutes } from '../../../core/onboarding/onboarding.models';
import { Chip } from '../../../shared/ui/chip/chip';
import { Icon } from '../../../shared/ui/icon/icon';
import { LanguageBadge } from '../../../shared/ui/language-badge/language-badge';
import { CourseRecommendation } from '../recommend-course';

const CONFETTI_COLORS = ['#14B8A6', '#FBBF24', '#FB923C', '#8B5CF6', '#38BDF8', '#22C55E'];

/** Deterministic pseudo-random pieces so SSR and the browser agree. */
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 53) % 20) / 10,
  duration: 2.6 + ((i * 29) % 15) / 10,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + (i % 3) * 2,
  round: i % 4 === 0,
}));

/** "Perfect match" card with a CSS-only confetti burst. */
@Component({
  selector: 'app-course-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, LanguageBadge],
  host: { class: 'relative block' },
  styles: `
    .confetti {
      position: fixed;
      top: -16px;
      animation: confetti var(--duration) ease-in var(--delay) 1 both;
      pointer-events: none;
      z-index: 30;
    }
    @keyframes confetti {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: translateY(105vh) rotate(540deg);
        opacity: 0;
      }
    }
  `,
  template: `
    <div aria-hidden="true">
      @for (piece of confetti; track $index) {
        <span
          class="confetti"
          [style.left.%]="piece.left"
          [style.width.px]="piece.size"
          [style.height.px]="piece.round ? piece.size : piece.size * 1.6"
          [style.background]="piece.color"
          [style.border-radius]="piece.round ? '999px' : '2px'"
          [style.--delay]="piece.delay + 's'"
          [style.--duration]="piece.duration + 's'"
        ></span>
      }
    </div>

    <article
      class="rounded-card border-2 border-primary bg-surface p-6 shadow-[0_4px_0_0_rgb(var(--c-primary-press))]"
    >
      <p class="eyebrow">Recommended course</p>
      <div class="mt-3 flex items-center gap-4">
        <app-language-badge [language]="recommendation().language" [size]="56" />
        <div>
          <h2 class="text-2xl font-extrabold">{{ recommendation().courseTitle }}</h2>
          <div class="mt-1.5 flex flex-wrap gap-2">
            <app-chip tone="primary" icon="clock">{{ dailyMinutes() }} min a day</app-chip>
            <app-chip tone="xp" icon="calendar"
              >About {{ recommendation().estimatedWeeks }} weeks</app-chip
            >
          </div>
        </div>
      </div>
      <ul class="mt-6 flex flex-col gap-4">
        @for (reason of recommendation().reasons; track reason.title) {
          <li class="flex gap-3">
            <app-icon name="check-circle" class="mt-0.5 text-success" />
            <span>
              <span class="block font-semibold">{{ reason.title }}</span>
              <span class="block text-sm text-muted">{{ reason.detail }}</span>
            </span>
          </li>
        }
      </ul>
    </article>
  `,
})
export class CourseSummary {
  readonly recommendation = input.required<CourseRecommendation>();
  readonly dailyMinutes = input.required<DailyMinutes>();

  protected readonly confetti = CONFETTI;
}
