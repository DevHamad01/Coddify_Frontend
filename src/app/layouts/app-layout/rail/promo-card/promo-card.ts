import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../../shared/ui/button/button';
import { Mascot } from '../../../../shared/ui/mascot/mascot';

const OFFER_HOURS = 48;

/** Welcome-offer card with a live countdown. Mock: the offer ends 48h after today's midnight. */
@Component({
  selector: 'app-promo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Mascot],
  templateUrl: './promo-card.html',
  styleUrl: './promo-card.scss',
})
export class PromoCard {
  private readonly endsAt = (() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start.getTime() + OFFER_HOURS * 3_600_000;
  })();
  private readonly now = signal(Date.now());

  protected readonly countdown = computed(() => {
    const left = Math.max(0, this.endsAt - this.now());
    const hours = Math.floor(left / 3_600_000);
    const minutes = Math.floor((left % 3_600_000) / 60_000);
    const seconds = Math.floor((left % 60_000) / 1000);
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
  });

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const timer = setInterval(() => this.now.set(Date.now()), 1000);
      inject(DestroyRef).onDestroy(() => clearInterval(timer));
    }
  }
}
