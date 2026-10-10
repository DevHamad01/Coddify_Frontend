import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-public-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navbar, Footer],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <a
      href="#main"
      class="sr-only z-50 rounded-btn bg-primary px-4 py-2 font-semibold text-primary-contrast focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
    <app-navbar />
    <main id="main" class="flex-1" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class PublicLayout {}
