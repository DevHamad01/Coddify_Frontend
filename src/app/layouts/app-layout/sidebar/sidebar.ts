import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Logo } from '../../../shared/ui/logo/logo';
import { NavArt } from '../../../shared/ui/nav-art/nav-art';
import { SearchDialogService } from '../../../shared/ui/search-dialog/search-dialog.service';
import { APP_NAV, PROFILE_NAV } from '../app-nav';

/**
 * Signed-in navigation. Full labels from `lg`, icon-only rail between `md` and `lg`;
 * phones use the bottom bar in the app layout instead.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Logo, NavArt],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly sections = APP_NAV;
  protected readonly profile = PROFILE_NAV;
  protected readonly search = inject(SearchDialogService);
}
