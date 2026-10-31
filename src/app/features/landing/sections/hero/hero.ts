import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../../shared/ui/button/button';
import { CountUp } from '../../../../shared/ui/count-up/count-up';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { CodeWindow } from '../../components/code-window/code-window';
import { HERO_CODE, HERO_STATS, HERO_TESTS } from '../../landing-content';
import { LanguageMarquee } from '../language-marquee/language-marquee';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, CountUp, Icon, Mascot, CodeWindow, LanguageMarquee],
  host: { class: 'relative block overflow-hidden' },
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly stats = HERO_STATS;
  protected readonly code = HERO_CODE;
  protected readonly tests = HERO_TESTS;
}
