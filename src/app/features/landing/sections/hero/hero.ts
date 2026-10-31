import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../../shared/ui/button/button';
import { CountUp } from '../../../../shared/ui/count-up/count-up';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { Globe } from '../../components/globe/globe';
import { GLOBE_PINGS, HERO_STATS } from '../../landing-content';
import { LanguageMarquee } from '../language-marquee/language-marquee';

/** Px from the top of the globe stage to the rim; the robot's hands sit on this line. */
const GLOBE_TOP = 130;
const ROBOT_SIZE = 156;
/** The peeking robot's hands sit 0.63 of its rendered width below its top edge. */
const ROBOT_HANDS_OFFSET = ROBOT_SIZE * 0.63;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, CountUp, Icon, Mascot, Globe, LanguageMarquee],
  host: { class: 'relative block overflow-hidden' },
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly stats = HERO_STATS;
  protected readonly pings = GLOBE_PINGS;
  protected readonly globeTop = GLOBE_TOP;
  protected readonly robotSize = ROBOT_SIZE;
  protected readonly robotTop = GLOBE_TOP - ROBOT_HANDS_OFFSET;
}
