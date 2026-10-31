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

/** Base wall of the node (72x68 artwork); the face below is the same shape raised 9px. */
const SIDE_PATH =
  'M30.8829 10.9944C32.4387 10.343 34.2035 10 36 10C37.7965 10 39.5613 10.343 41.1171 10.9944L66.8829 21.781C68.4386 22.4325 69.7306 23.3694 70.6288 24.4978C71.527 25.6261 72 26.9061 72 28.209V49.788C72 51.091 71.527 52.3709 70.6288 53.4992C69.7306 54.6276 68.4386 55.5646 66.8829 56.216L41.1171 67.0056C39.5613 67.657 37.7965 68 36 68C34.2035 68 32.4387 67.657 30.8829 67.0056L5.11712 56.216C3.56136 55.5646 2.26944 54.6276 1.3712 53.4992C0.472955 52.3709 0 51.091 0 49.788V28.212C-0.00067241 26.9085 0.471895 25.628 1.37017 24.4991C2.26845 23.3702 3.56076 22.4327 5.11712 21.781L30.8829 10.9944Z';

const TOP_PATH =
  'M31.269 1.91687C32.6948 1.31987 34.3274 1 36 1C37.6726 1 39.3052 1.31987 40.7309 1.91684L66.4966 12.7034C67.9237 13.301 69.0695 14.1446 69.8464 15.1206C70.6198 16.092 71 17.1568 71 18.209V39.788C71 40.8403 70.6198 41.905 69.8464 42.8764C69.0694 43.8525 67.9237 44.6961 66.4966 45.2936L40.7309 56.0832C39.3052 56.6801 37.6726 57 36 57C34.3274 57 32.6948 56.6801 31.2691 56.0832L5.50338 45.2936C4.07632 44.6961 2.93056 43.8525 2.15356 42.8764C1.38023 41.905 1 40.8403 1 39.788V18.212C0.999457 17.1588 1.37935 16.0936 2.15268 15.1217C2.92967 14.1452 4.07573 13.3012 5.50329 12.7034L31.269 1.91687Z';

/** Inset plate (58x42) that holds the icon, centred on the face. */
const HEAD_PATH =
  'M24.8779 0.720114C26.1312 0.248359 27.5528 0 29 0C30.4472 0 31.8688 0.248359 33.1221 0.720114L53.8779 8.53107C55.1311 9.00281 56.1718 9.68132 56.8954 10.4984C57.619 11.3155 58 12.2423 58 13.1858V28.812C58 29.7555 57.619 30.6824 56.8954 31.4995C56.1718 32.3165 55.1311 32.995 53.8779 33.4668L33.1221 41.2799C31.8688 41.7516 30.4472 42 29 42C27.5528 42 26.1312 41.7516 24.8779 41.2799L4.12213 33.4668C2.86887 32.995 1.82816 32.3165 1.10457 31.4995C0.380991 30.6824 0 29.7555 0 28.812V13.188C-0.000541663 12.2441 0.380137 11.3168 1.10375 10.4993C1.82736 9.68184 2.86839 9.00299 4.12213 8.53107L24.8779 0.720114Z';

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

  protected readonly sidePath = SIDE_PATH;
  protected readonly topPath = TOP_PATH;
  protected readonly headPath = HEAD_PATH;

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
