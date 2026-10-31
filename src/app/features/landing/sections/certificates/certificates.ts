import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../../shared/ui/chip/chip';
import { Icon } from '../../../../shared/ui/icon/icon';
import { LANGUAGES } from '../../../../shared/data/languages';
import { LanguageBadge } from '../../../../shared/ui/language-badge/language-badge';
import { FeatureSplit } from '../../components/feature-split/feature-split';

@Component({
  selector: 'app-certificates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, LanguageBadge, FeatureSplit],
  host: { id: 'certificates', class: 'block scroll-mt-16' },
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates {
  protected readonly python = LANGUAGES[0];
  protected readonly points = [
    'Unique link anyone can verify',
    'Lists the skills and projects you completed',
    'Share to LinkedIn in one click',
  ];
}
