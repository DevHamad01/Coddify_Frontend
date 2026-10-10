import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { Mascot, MascotPose } from '../../../../shared/ui/mascot/mascot';

const BENEFITS: readonly { icon: IconName; text: string }[] = [
  { icon: 'code', text: 'Practice-first lessons, real code every day' },
  { icon: 'flame', text: 'Streaks and weekly leagues keep you going' },
  { icon: 'sparkles', text: 'An AI tutor that hints, never spoon-feeds' },
  { icon: 'award', text: 'Certificates you can share on LinkedIn' },
  { icon: 'monitor', text: 'Works on any laptop or phone, no setup' },
];

/**
 * Split auth layout: form card on the left, mascot + benefits panel on the right (desktop only).
 * `showTabs` adds the Log in | Register switch used on those two pages.
 */
@Component({
  selector: 'app-auth-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, Mascot],
  host: { class: 'container-page flex flex-1 items-center py-6 sm:py-10' },
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
})
export class AuthShell {
  readonly heading = input.required<string>();
  readonly subheading = input<string>('');
  readonly showTabs = input<boolean>(false);
  readonly pose = input<MascotPose>('happy');
  readonly panelHeading = input<string>('Unlock your coding journey');

  protected readonly benefits = BENEFITS;
}
