import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JourneyNode } from '../../../../core/learning/learning.models';
import { Button } from '../../../../shared/ui/button/button';

const KIND_LABEL: Record<JourneyNode['kind'], string> = {
  lesson: 'Lesson',
  quiz: 'Quiz',
  practice: 'Practice',
  chest: 'Reward',
};

/** Card under a selected path node: what it is, and the one action available right now. */
@Component({
  selector: 'app-node-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button],
  host: { role: 'dialog', '[attr.aria-label]': 'node().title' },
  templateUrl: './node-popover.html',
  styleUrl: './node-popover.scss',
})
export class NodePopover {
  readonly node = input.required<JourneyNode>();
  readonly claiming = input<boolean>(false);
  readonly claim = output<void>();

  protected readonly kindLabel = computed(() => KIND_LABEL[this.node().kind]);
  protected readonly lockedHint = computed(() =>
    this.node().kind === 'chest'
      ? 'Finish this chapter to open the chest.'
      : 'Complete the lesson above to unlock this!',
  );
}
