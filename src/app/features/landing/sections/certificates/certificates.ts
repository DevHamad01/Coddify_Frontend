import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../../shared/ui/chip/chip';
import { Icon } from '../../../../shared/ui/icon/icon';
import { LANGUAGES } from '../../../../shared/data/languages';
import { LanguageBadge } from '../../../../shared/ui/language-badge/language-badge';
import { TechId } from '../../../../shared/data/tech';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { FeatureSplit } from '../../components/feature-split/feature-split';

@Component({
  selector: 'app-certificates',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, LanguageBadge, TechLogo, FeatureSplit],
  host: { id: 'certificates', class: 'block scroll-mt-16' },
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates {
  protected readonly python = LANGUAGES[0];
  /** Certificates fanned out behind the front one. */
  protected readonly backs: readonly {
    course: string;
    tech: TechId;
    color: string;
    position: 'is-left' | 'is-right';
  }[] = [
    { course: 'JavaScript Basics', tech: 'javascript', color: '#F7DF1E', position: 'is-left' },
    { course: 'C++ Essentials', tech: 'cpp', color: '#00599C', position: 'is-right' },
  ];
  protected readonly points = [
    'Unique link anyone can verify',
    'Lists the skills and projects you completed',
    'Share to LinkedIn in one click',
  ];
}
