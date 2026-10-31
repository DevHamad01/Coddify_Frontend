import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';

const LINKS: readonly { label: string; path: string }[] = [
  { label: 'About', path: '/about' },
  { label: 'Certificates', path: '/resources/certificates' },
  { label: 'Mobile App', path: '/resources/mobile-app' },
  { label: 'Teachers', path: '/resources/teachers' },
  { label: 'Blog', path: '/resources/blog' },
  { label: 'Contact', path: '/contact' },
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
];

const SOCIALS: readonly { label: string; icon: IconName }[] = [
  { label: 'Instagram (coming soon)', icon: 'instagram' },
  { label: 'YouTube (coming soon)', icon: 'youtube' },
  { label: 'LinkedIn (coming soon)', icon: 'linkedin' },
];

@Component({
  selector: 'app-rail-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './rail-footer.html',
  styleUrl: './rail-footer.scss',
})
export class RailFooter {
  protected readonly links = LINKS;
  protected readonly socials = SOCIALS;
}
