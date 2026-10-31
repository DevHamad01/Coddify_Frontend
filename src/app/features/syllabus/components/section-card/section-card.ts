import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { CourseSection } from '../../../../core/learning/learning.models';
import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';

/** One syllabus section: where it stands and the button to continue or jump into it. */
@Component({
  selector: 'app-section-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  host: { '[class.is-current]': "section().state === 'in-progress'" },
  templateUrl: './section-card.html',
  styleUrl: './section-card.scss',
})
export class SectionCard {
  readonly section = input.required<CourseSection>();
  readonly busy = input<boolean>(false);
  readonly opened = output<void>();

  protected readonly percent = computed(() => {
    const section = this.section();
    return Math.round((section.completedCount / section.lessonCount) * 100);
  });
}
