import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NavArtName =
  | 'journey'
  | 'practice'
  | 'projects'
  | 'history'
  | 'interview'
  | 'missions'
  | 'leaderboard'
  | 'store'
  | 'search'
  | 'profile'
  | 'flame'
  | 'gem'
  | 'energy'
  | 'chest'
  | 'mission-mark';

/**
 * Small full-colour illustrations for the app sidebar and gamification counters.
 * Hand-drawn SVG with fixed brand colours (these are art, not themeable UI icons).
 */
@Component({
  selector: 'app-nav-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  templateUrl: './nav-art.html',
  styleUrl: './nav-art.scss',
})
export class NavArt {
  readonly name = input.required<NavArtName>();
  readonly size = input<number>(28);
  /** Greys the art out, e.g. for a cold streak flame. */
  readonly muted = input<boolean>(false);
}
