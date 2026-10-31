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

const linksOf = (id: string): readonly NavLink[] =>
  NAV_MENUS.find((menu) => menu.id === id)?.links ?? [];

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
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly columns = COLUMNS;
  protected readonly socials = SOCIALS;
  protected readonly year = new Date().getFullYear();
}
