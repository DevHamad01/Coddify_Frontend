import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { CareerPath } from '../../journeys-content';

/** A career path card: stacked course logos, title and the order of courses. */
@Component({
  selector: 'app-path-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TechLogo],
  templateUrl: './path-card.html',
  styleUrl: './path-card.scss',
})
export class PathCard {
  readonly path = input.required<CareerPath>();
  readonly opened = output<void>();
}
