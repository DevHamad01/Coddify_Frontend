import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LegalDoc } from '../legal-doc/legal-doc';
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from './privacy-content';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalDoc],
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly intro = PRIVACY_INTRO;
  protected readonly updated = PRIVACY_UPDATED;
  protected readonly sections = PRIVACY_SECTIONS;
}
