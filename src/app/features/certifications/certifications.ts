import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { TECHS } from '../../shared/data/tech';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { TechLogo } from '../../shared/ui/tech-logo/tech-logo';
import { FinalCta } from '../landing/sections/final-cta/final-cta';
import {
  CATEGORY_BLURB,
  CERTIFICATE_FAQ,
  INCLUDED,
  PATH_CERTIFICATES,
  STEPS,
} from './certifications-content';

/** Certificate IDs look like CDF-7K2Q-9XWD. */
const ID_PATTERN = /^CDF-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

type VerifyState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'not-found'; readonly id: string };

@Component({
  selector: 'app-certifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Accordion, Button, Icon, TechLogo, FinalCta],
  host: { class: 'block' },
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class Certifications {
  protected readonly auth = inject(AuthService);

  protected readonly courses = TECHS.map((tech) => ({
    ...tech,
    blurb: CATEGORY_BLURB[tech.categories[0]],
  }));
  protected readonly paths = PATH_CERTIFICATES;
  protected readonly steps = STEPS;
  protected readonly included = INCLUDED;
  protected readonly faq = CERTIFICATE_FAQ;

  protected readonly startLink = computed(() =>
    this.auth.isAuthenticated() ? '/app/journey' : '/register',
  );

  protected readonly verifyId = signal('');
  protected readonly verify = signal<VerifyState>({ kind: 'idle' });

  protected onVerifyInput(event: Event): void {
    this.verifyId.set((event.target as HTMLInputElement).value);
    this.verify.set({ kind: 'idle' });
  }

  /**
   * No certificates are issued yet (the certificate API comes with the admin flow),
   * so a well-formed ID simply reports that nothing matches.
   */
  protected submitVerify(event: Event): void {
    event.preventDefault();
    const id = this.verifyId().trim().toUpperCase();
    this.verify.set(ID_PATTERN.test(id) ? { kind: 'not-found', id } : { kind: 'invalid' });
  }
}
