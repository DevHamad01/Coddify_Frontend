import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ProgressStore } from '../../core/gamification/progress.store';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { APP_NAV, PROFILE_NAV } from './app-nav';
import { Sidebar } from './sidebar/sidebar';

/** Signed-in shell: sidebar (md+) or bottom bar (phones) around the routed page. */
@Component({
  selector: 'app-app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Sidebar, NavArt],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
  protected readonly mobileNav = [
    ...APP_NAV.flatMap((section) => section.items).filter((item) => item.mobile),
    PROFILE_NAV,
  ];

  constructor() {
    inject(ProgressStore).ensureLoaded();
  }
}
