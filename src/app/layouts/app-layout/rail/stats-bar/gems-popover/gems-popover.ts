import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NavArt } from '../../../../../shared/ui/nav-art/nav-art';

/** The gem balance and how gems are earned. */
@Component({
  selector: 'app-gems-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavArt],
  templateUrl: './gems-popover.html',
  styleUrl: './gems-popover.scss',
})
export class GemsPopover {
  readonly gems = input.required<number>();
}
