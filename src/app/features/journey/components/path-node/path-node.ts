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

/** Pointy-top hexagon centred in the 96x104 viewBox, and a smaller copy for the bevel line. */
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

const HEX = hexPoints(48, 46, 38);
const INNER_HEX = hexPoints(48, 46, 30);
let nextId = 0;

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

  protected readonly hex = HEX;
  protected readonly innerHex = INNER_HEX;
  /** Gradient ids must be unique per page. */
  protected readonly gradientId = `hex-face-${nextId++}`;

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
