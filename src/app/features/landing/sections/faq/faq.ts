import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Accordion } from '../../../../shared/ui/accordion/accordion';
import { FAQ_ITEMS } from '../../landing-content';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Accordion],
  host: { id: 'faq', class: 'block section scroll-mt-16' },
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly items = FAQ_ITEMS;
}
