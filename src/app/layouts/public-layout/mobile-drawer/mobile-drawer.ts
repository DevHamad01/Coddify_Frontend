import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { LANGUAGES } from '../../../shared/data/languages';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { LanguageBadge } from '../../../shared/ui/language-badge/language-badge';
import { Logo } from '../../../shared/ui/logo/logo';
import { ThemeToggle } from '../../../shared/ui/theme-toggle/theme-toggle';
import { NAV_MENUS } from '../nav-items';

/** Full-height navigation drawer for < lg screens. Traps Tab focus while open. */
@Component({
  selector: 'app-mobile-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, LanguageBadge, Logo, ThemeToggle],
  host: {
    class: 'fixed inset-0 z-50 lg:hidden',
    '(keydown)': 'trapFocus($event)',
  },
  templateUrl: './mobile-drawer.html',
  styleUrl: './mobile-drawer.scss',
})
export class MobileDrawer {
  readonly closed = output<void>();

  protected readonly menus = NAV_MENUS;
  protected readonly languages = LANGUAGES;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.host.nativeElement
        .querySelector<HTMLButtonElement>('button[aria-label="Close menu"]')
        ?.focus();
    });
  }

  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.host.nativeElement.ownerDocument.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}
