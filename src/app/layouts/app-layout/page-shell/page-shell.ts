import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RailFooter } from '../rail/rail-footer/rail-footer';
import { StatsBar } from '../rail/stats-bar/stats-bar';

/**
 * Two-column frame for app pages: the page content, and a right rail that always starts with the
 * stats bar and ends with the footer. Pages project their own widgets with the `rail` attribute:
 * `<app-page-shell><section>…</section><app-level-card rail /></app-page-shell>`.
 * Below `xl` the rail is hidden and the stats bar moves to the top of the page.
 */
@Component({
  selector: 'app-page-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatsBar, RailFooter],
  templateUrl: './page-shell.html',
  styleUrl: './page-shell.scss',
})
export class PageShell {
  /** Width of the main column. */
  readonly width = input<'narrow' | 'wide'>('narrow');
}
