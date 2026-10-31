import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';
import { FeatureSplit } from '../../components/feature-split/feature-split';
import { LEAGUE_ROWS, PROMOTION_SPOTS } from '../../landing-content';

const MEDAL: Partial<Record<number, string>> = {
  1: 'bg-xp text-[#0B1220]',
  2: 'bg-[#CBD5E1] text-[#0B1220]',
  3: 'bg-streak text-[#0B1220]',
};

@Component({
  selector: 'app-league',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, FeatureSplit],
  host: { id: 'leagues', class: 'block scroll-mt-16' },
  templateUrl: './league.html',
  styleUrl: './league.scss',
})
export class League {
  protected readonly rows = LEAGUE_ROWS;
  protected readonly promotionSpots = PROMOTION_SPOTS;
  protected readonly medal = MEDAL;
}
