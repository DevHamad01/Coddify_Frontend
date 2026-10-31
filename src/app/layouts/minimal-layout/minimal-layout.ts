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
  templateUrl: './minimal-layout.html',
  styleUrl: './minimal-layout.scss',
})
export class MinimalLayout {}
