import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { Mascot } from '../../../../shared/ui/mascot/mascot';

/** Reward items floating around the celebrating robot. Positions are % of the band. */
const REWARDS: readonly { icon: IconName; color: string; pos: string; delay: string }[] = [
  { icon: 'flame', color: 'text-streak', pos: 'left-[10%] top-[30%]', delay: '0s' },
  { icon: 'bolt', color: 'text-xp', pos: 'left-[24%] top-[60%]', delay: '0.6s' },
  { icon: 'trophy', color: 'text-xp', pos: 'right-[12%] top-[28%]', delay: '1.2s' },
  { icon: 'star', color: 'text-xp', pos: 'right-[26%] top-[62%]', delay: '0.3s' },
  { icon: 'award', color: 'text-info', pos: 'left-[38%] top-[18%] hidden sm:block', delay: '0.9s' },
];

@Component({
  selector: 'app-final-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, Mascot],
  host: { class: 'block pt-16 md:pt-24' },
  templateUrl: './final-cta.html',
  styleUrl: './final-cta.scss',
})
export class FinalCta {
  protected readonly rewards = REWARDS;
}
