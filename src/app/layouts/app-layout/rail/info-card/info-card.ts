import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NavArt, NavArtName } from '../../../../shared/ui/nav-art/nav-art';

/** Short explainer card with an illustration peeking in from the right ("Conquer them all"). */
@Component({
  selector: 'app-info-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavArt],
  templateUrl: './info-card.html',
  styleUrl: './info-card.scss',
})
export class InfoCard {
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly art = input<NavArtName>('missions');
}
