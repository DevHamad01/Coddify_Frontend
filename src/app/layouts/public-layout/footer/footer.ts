import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LANGUAGES } from '../../../shared/data/languages';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconName } from '../../../shared/ui/icon/icons';
import { Logo } from '../../../shared/ui/logo/logo';
import { NAV_MENUS, NavLink } from '../nav-items';

interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

const linksOf = (id: string): readonly NavLink[] => NAV_MENUS.find((menu) => menu.id === id)?.links ?? [];

const COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Learn',
    links: LANGUAGES.map((language) => ({ label: language.name, path: '/register' })),
  },
  { title: 'Resources', links: linksOf('resources') },
  { title: 'Company', links: linksOf('company') },
];

/** Social profiles are placeholders until the official accounts exist. */
const SOCIALS: readonly { label: string; icon: IconName }[] = [
  { label: 'Coddify on Instagram (coming soon)', icon: 'instagram' },
  { label: 'Coddify on YouTube (coming soon)', icon: 'youtube' },
  { label: 'Coddify on LinkedIn (coming soon)', icon: 'linkedin' },
];

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Logo],
  host: { class: 'block border-t border-border bg-surface' },
  template: `
    <div class="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div class="flex flex-col gap-4">
        <app-logo />
        <p class="max-w-xs text-sm leading-6 text-muted">
          Small daily lessons, real code and a tutor that nudges instead of spoon-feeding.
        </p>
        <ul class="flex gap-2" aria-label="Social media">
          @for (social of socials; track social.icon) {
            <li>
              <a
                href="#"
                (click)="$event.preventDefault()"
                class="flex h-10 w-10 items-center justify-center rounded-btn border border-border text-muted transition-colors duration-hover hover:border-primary/60 hover:text-primary"
                [attr.aria-label]="social.label"
              >
                <app-icon [name]="social.icon" [size]="18" />
              </a>
            </li>
          }
        </ul>
      </div>

      @for (column of columns; track column.title) {
        <div>
          <h2 class="mb-3 text-sm font-bold">{{ column.title }}</h2>
          <ul class="flex flex-col gap-2">
            @for (link of column.links; track link.label) {
              <li>
                <a
                  [routerLink]="link.path"
                  [fragment]="link.fragment"
                  class="text-sm text-muted transition-colors duration-hover hover:text-primary"
                >
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        </div>
      }
    </div>
    <div class="border-t border-border">
      <p class="container-page py-5 text-center text-xs text-muted sm:text-left">
        © {{ year }} Coddify. A Final Year Project, made with care in Pakistan.
      </p>
    </div>
  `,
})
export class Footer {
  protected readonly columns = COLUMNS;
  protected readonly socials = SOCIALS;
  protected readonly year = new Date().getFullYear();
}
