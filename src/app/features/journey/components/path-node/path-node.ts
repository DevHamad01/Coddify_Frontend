import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { JourneyNode } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { NavArt } from '../../../../shared/ui/nav-art/nav-art';

const KIND_ICON: Record<Exclude<JourneyNode['kind'], 'chest'>, IconName> = {
  lesson: 'book',
  quiz: 'help-circle',
  practice: 'code',
};

/** Chunky 3D hexagon on the journey path. Completed = green, current = teal + START, locked = grey. */
@Component({
  selector: 'app-path-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, NavArt],
  templateUrl: './path-node.html',
  styleUrl: './path-node.scss',
})
export class PathNode {
  readonly node = input.required<JourneyNode>();
  readonly selected = input<boolean>(false);
  readonly pressed = output<void>();

  protected readonly icon = computed<IconName>(() => {
    const node = this.node();
    if (node.state === 'completed') {
      return 'check';
    }
    return node.kind === 'chest' ? 'gift' : KIND_ICON[node.kind];
  });

  protected readonly ariaLabel = computed(() => {
    const node = this.node();
    const state = { completed: 'completed', current: 'up next', locked: 'locked' }[node.state];
    return `${node.title}, ${state}`;
  });
}
