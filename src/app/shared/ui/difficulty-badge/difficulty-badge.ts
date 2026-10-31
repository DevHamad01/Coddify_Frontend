import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DIFFICULTIES, Difficulty } from '../../../core/practice/practice.models';

/** Four signal bars, filled up to the difficulty, plus its name in the matching colour. */
@Component({
  selector: 'app-difficulty-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-level]': 'level()' },
  templateUrl: './difficulty-badge.html',
  styleUrl: './difficulty-badge.scss',
})
export class DifficultyBadge {
  readonly difficulty = input.required<Difficulty>();
  readonly showLabel = input<boolean>(true);

  protected readonly bars = [1, 2, 3, 4];
  protected readonly level = computed(() => DIFFICULTIES.indexOf(this.difficulty()) + 1);
}
