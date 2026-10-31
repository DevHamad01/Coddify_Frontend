import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NavArt } from '../nav-art/nav-art';

/** The streak flame in an unlockable colour ("blue", "gold", "rainbow"…). */
@Component({
  selector: 'app-streak-flame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavArt],
  host: { '[attr.data-color]': 'color()' },
  templateUrl: './streak-flame.html',
  styleUrl: './streak-flame.scss',
})
export class StreakFlame {
  readonly color = input<string>('classic');
  readonly size = input<number>(24);
  /** Greyed out until today's first activity. */
  readonly muted = input<boolean>(false);
}
