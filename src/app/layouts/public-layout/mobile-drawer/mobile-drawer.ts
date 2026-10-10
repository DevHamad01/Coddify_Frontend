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
  template: `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" (click)="closed.emit()"></div>
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      class="absolute inset-y-0 right-0 flex w-full max-w-sm animate-slide-in flex-col bg-surface shadow-modal"
    >
      <div class="flex h-16 items-center justify-between border-b border-border px-4">
        <app-logo />
        <button
          #closeButton
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-btn text-text hover:bg-surface-2"
          aria-label="Close menu"
          (click)="closed.emit()"
        >
          <app-icon name="x" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
        <p class="eyebrow mb-3">Languages</p>
        <ul class="mb-6 grid grid-cols-2 gap-2">
          @for (language of languages; track language.id) {
            <li>
              <a
                routerLink="/register"
                [queryParams]="{ lang: language.id }"
                class="flex items-center gap-2.5 rounded-btn border border-border p-2.5 text-sm font-semibold text-text hover:bg-surface-2"
              >
                <app-language-badge [language]="language" [size]="26" />
                {{ language.name }}
              </a>
            </li>
          }
        </ul>

        @for (menu of menus; track menu.id) {
          <p class="eyebrow mb-2">{{ menu.label }}</p>
          <ul class="mb-6 flex flex-col">
            @for (link of menu.links; track link.label) {
              <li>
                <a
                  [routerLink]="link.path"
                  [fragment]="link.fragment"
                  class="flex items-center gap-3 rounded-btn px-2 py-2.5 text-[15px] font-medium text-text hover:bg-surface-2"
                >
                  @if (link.icon) {
                    <app-icon [name]="link.icon" [size]="18" class="text-primary" />
                  }
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        }

        <p class="eyebrow mb-2">Appearance</p>
        <app-theme-toggle mode="segmented" />
      </nav>

      <div class="flex flex-col gap-3 border-t border-border p-4">
        <a appButton routerLink="/register" [block]="true">Get Started</a>
        <a appButton variant="secondary" routerLink="/login" [block]="true">Log in</a>
      </div>
    </aside>
  `,
})
export class MobileDrawer {
  readonly closed = output<void>();

  protected readonly menus = NAV_MENUS;
  protected readonly languages = LANGUAGES;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.host.nativeElement.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]')?.focus();
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
