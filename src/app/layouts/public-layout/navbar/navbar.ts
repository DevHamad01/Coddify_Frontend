import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { Logo } from '../../../shared/ui/logo/logo';
import { SearchDialogService } from '../../../shared/ui/search-dialog/search-dialog.service';
import { ThemeToggle } from '../../../shared/ui/theme-toggle/theme-toggle';
import { NAV_MENUS } from '../nav-items';
import { CatalogMenu } from './catalog-menu/catalog-menu';
import { ResourcesMenu } from './resources-menu/resources-menu';
import { MobileDrawer } from '../mobile-drawer/mobile-drawer';

type MenuId = 'catalog' | 'resources' | 'company';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, Logo, ThemeToggle, MobileDrawer, CatalogMenu, ResourcesMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  host: {
    // No backdrop-filter on the host: it would trap the fixed-position drawer inside the bar.
    class: 'sticky top-0 z-40 block',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeAll()',
  },
})
export class Navbar {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  protected readonly auth = inject(AuthService);
  protected readonly search = inject(SearchDialogService);
  protected readonly company = NAV_MENUS.find((menu) => menu.id === 'company')!.links;
  protected readonly openMenu = signal<MenuId | null>(null);
  protected readonly drawerOpen = signal(false);

  constructor() {
    const sub = inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeAll();
      }
    });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }

  protected toggleMenu(id: MenuId): void {
    this.openMenu.update((current) => (current === id ? null : id));
  }

  protected setDrawer(open: boolean): void {
    this.drawerOpen.set(open);
    this.openMenu.set(null);
    // Lock page scroll behind the drawer. Only reached from user events, so always in the browser.
    this.document.body.style.overflow = open ? 'hidden' : '';
  }

  protected closeAll(): void {
    this.openMenu.set(null);
    if (this.drawerOpen()) {
      this.setDrawer(false);
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.openMenu() && !this.host.nativeElement.contains(event.target as Node)) {
      this.openMenu.set(null);
    }
  }
}
