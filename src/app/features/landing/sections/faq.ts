import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Accordion } from '../../../shared/ui/accordion/accordion';
import { FAQ_ITEMS } from '../landing-content';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Accordion],
  host: { id: 'faq', class: 'block section scroll-mt-16' },
  template: `
    <div class="container-page max-w-3xl">
      <h2 class="mb-10 text-center text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
      <app-accordion [items]="items" />
    </div>
  `,
})
export class Faq {
  protected readonly items = FAQ_ITEMS;
}
