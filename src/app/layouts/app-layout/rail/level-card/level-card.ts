import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ProgressStore } from '../../../../core/gamification/progress.store';
import { ProgressBar } from '../../../../shared/ui/progress-bar/progress-bar';

@Component({
  selector: 'app-level-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  templateUrl: './level-card.html',
  styleUrl: './level-card.scss',
})
export class LevelCard {
  protected readonly store = inject(ProgressStore);
  protected readonly percent = computed(() => {
    const stats = this.store.stats();
    return stats ? Math.round((stats.levelXp / stats.levelXpTarget) * 100) : 0;
  });
}
