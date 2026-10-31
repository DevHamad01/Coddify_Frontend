import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressStore } from '../../../../core/gamification/progress.store';
import { NavArt } from '../../../../shared/ui/nav-art/nav-art';

/** Today's missions with progress bars. `showHeader` is off on the Missions page itself. */
@Component({
  selector: 'app-missions-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavArt],
  templateUrl: './missions-widget.html',
  styleUrl: './missions-widget.scss',
})
export class MissionsWidget {
  readonly showHeader = input<boolean>(true);
  protected readonly store = inject(ProgressStore);
  protected readonly placeholders = [1, 2, 3];
}
