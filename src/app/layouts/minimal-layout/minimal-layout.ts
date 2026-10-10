import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Logo } from '../../shared/ui/logo/logo';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';

/** Logo-only shell for auth and onboarding: no navigation to distract from the task. */
@Component({
  selector: 'app-minimal-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Logo, ThemeToggle],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <header class="container-page flex h-16 shrink-0 items-center justify-between">
      <app-logo />
      <app-theme-toggle />
    </header>
    <main id="main" class="flex flex-1 flex-col" tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class MinimalLayout {}
