import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { FinalCta } from '../landing/sections/final-cta/final-cta';

interface Pillar {
  readonly icon: IconName;
  readonly title: string;
  readonly body: string;
}

const PILLARS: readonly Pillar[] = [
  {
    icon: 'terminal',
    title: 'Practice first',
    body: 'You learn to code by writing code. Every lesson ends in a challenge you solve in a real editor, right in the browser, with nothing to install.',
  },
  {
    icon: 'infinity',
    title: 'Always growing',
    body: 'Courses, practice problems and interview questions are written by our team and keep growing, so there is always a next step to take.',
  },
  {
    icon: 'gamepad',
    title: 'Fun on purpose',
    body: 'XP, streaks, missions and weekly leagues turn a hard skill into a daily game. Small wins add up faster than long, boring sessions.',
  },
  {
    icon: 'user',
    title: 'Made for you',
    body: 'Onboarding asks what you want to build and what you already know, then picks the course and pace that fit you.',
  },
  {
    icon: 'sparkles',
    title: 'AI that teaches',
    body: 'Bit, our AI tutor, sits next to every challenge. It explains errors and nudges you forward with hints instead of handing over the answer.',
  },
];

const FACTS: readonly { value: string; label: string }[] = [
  { value: '100%', label: 'Free, forever' },
  { value: '5 min', label: 'A lesson a day' },
  { value: '0', label: 'Ads or paywalls' },
];

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Mascot, FinalCta],
  host: { class: 'block' },
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly pillars = PILLARS;
  protected readonly facts = FACTS;
}
