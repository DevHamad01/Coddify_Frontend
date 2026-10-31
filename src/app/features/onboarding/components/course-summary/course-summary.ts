import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DailyMinutes } from '../../../../core/onboarding/onboarding.models';
import { Chip } from '../../../../shared/ui/chip/chip';
import { Icon } from '../../../../shared/ui/icon/icon';
import { LanguageBadge } from '../../../../shared/ui/language-badge/language-badge';
import { CourseRecommendation } from '../../recommend-course';

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
  templateUrl: './course-summary.html',
  styleUrl: './course-summary.scss',
})
export class CourseSummary {
  readonly recommendation = input.required<CourseRecommendation>();
  readonly dailyMinutes = input.required<DailyMinutes>();

  protected readonly confetti = CONFETTI;
}
