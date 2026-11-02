import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LegalDoc } from '../legal-doc/legal-doc';
import { TERMS_INTRO, TERMS_SECTIONS, TERMS_UPDATED } from './terms-content';

@Component({
  selector: 'app-terms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalDoc],
  templateUrl: './terms.html',
})
export class Terms {
  protected readonly intro = TERMS_INTRO;
  protected readonly updated = TERMS_UPDATED;
  protected readonly sections = TERMS_SECTIONS;
}
