import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProgressStore } from '../../../../core/gamification/progress.store';
import { NavArt } from '../../../../shared/ui/nav-art/nav-art';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';

/** Current course, streak, and gems. The flame greys out until today's first lesson. */
@Component({
  selector: 'app-stats-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavArt, TechLogo],
  templateUrl: './stats-bar.html',
  styleUrl: './stats-bar.scss',
})
export class StatsBar {
  protected readonly store = inject(ProgressStore);
}
