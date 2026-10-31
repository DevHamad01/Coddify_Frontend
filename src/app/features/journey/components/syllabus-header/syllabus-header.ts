import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Journey, JourneyChapter } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { SearchDialogService } from '../../../../shared/ui/search-dialog/search-dialog.service';

/** Segments drawn when no daily goal is set yet. */
const DEFAULT_SEGMENTS = 4;

/**
 * Card on top of the journey: the chapter in view (updates while scrolling) and today's
 * progress towards the daily goal. Clicking the goal bar opens the goal picker.
 */
@Component({
  selector: 'app-syllabus-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './syllabus-header.html',
  styleUrl: './syllabus-header.scss',
})
export class SyllabusHeader {
  readonly journey = input.required<Journey>();
  readonly chapter = input.required<JourneyChapter>();
  readonly dailyGoal = input<number | null>(null);
  readonly activitiesToday = input<number>(0);
  readonly goalClicked = output<void>();

  protected readonly search = inject(SearchDialogService);

  protected readonly segments = computed(() =>
    Array.from({ length: this.dailyGoal() ?? DEFAULT_SEGMENTS }, (_, i) => i),
  );
  protected readonly done = computed(() =>
    this.dailyGoal() === null ? 0 : Math.min(this.activitiesToday(), this.dailyGoal()!),
  );
}
