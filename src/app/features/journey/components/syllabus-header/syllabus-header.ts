import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Journey, JourneyChapter } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { SearchDialogService } from '../../../../shared/ui/search-dialog/search-dialog.service';

/** Card on top of the journey: where you are in the syllabus and how far through the chapter. */
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

  protected readonly search = inject(SearchDialogService);

  /** One segment per activity (chests are rewards, not activities). */
  protected readonly segments = computed(() =>
    this.chapter().nodes.filter((node) => node.kind !== 'chest'),
  );
  protected readonly done = computed(
    () => this.segments().filter((node) => node.state === 'completed').length,
  );
}
