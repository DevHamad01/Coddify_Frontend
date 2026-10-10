import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconName } from '../../../shared/ui/icon/icons';
import { Mascot } from '../../../shared/ui/mascot/mascot';

/** Reward items floating around the celebrating owl. Positions are % of the band. */
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
  template: `
    <div class="container-page flex flex-col items-center text-center">
      <h2 class="text-balance max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
        Your first small win is five minutes away
      </h2>
      <p class="mt-4 max-w-lg text-lg text-muted">
        Pick a language, write a line of code, and start your streak today.
      </p>
      <a appButton size="lg" routerLink="/register" class="mt-8 w-full max-w-xs">Get Started</a>
    </div>

    <div class="relative mt-12 h-64 overflow-hidden sm:h-72" aria-hidden="true">
      <svg
        class="absolute inset-0 h-full w-full text-primary"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 40C180 40 260 120 420 150c180 34 300 80 300 80s120-46 300-80c160-30 240-110 420-110v260H0z"
        />
      </svg>
      @for (reward of rewards; track reward.icon) {
        <app-icon
          [name]="reward.icon"
          [size]="40"
          [filled]="true"
          class="absolute animate-float drop-shadow-lg"
          [class]="reward.color + ' ' + reward.pos"
          [style.animation-delay]="reward.delay"
        />
      }
      <app-mascot
        pose="celebrating"
        [size]="150"
        class="absolute bottom-4 left-1/2 -translate-x-1/2"
      />
    </div>
  `,
})
export class FinalCta {
  protected readonly rewards = REWARDS;
}
