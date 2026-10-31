import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './core/theme/theme.service';
import { SearchDialog } from './shared/ui/search-dialog/search-dialog';
import { ToastHost } from './shared/ui/toast/toast-host/toast-host';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ToastHost, SearchDialog],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Instantiate early so the saved theme and system-theme listener are active app-wide.
    inject(ThemeService);
  }
}
