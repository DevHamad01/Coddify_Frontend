import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarLook, DEFAULT_AVATAR } from '../../data/avatar-parts';

/** The learner's cartoon avatar, drawn in SVG from an `AvatarLook`. */
@Component({
  selector: 'app-person-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': 'label()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  templateUrl: './person-avatar.html',
  styleUrl: './person-avatar.scss',
})
export class PersonAvatar {
  readonly look = input<AvatarLook>(DEFAULT_AVATAR);
  readonly size = input<number>(120);
  readonly label = input<string>('Avatar');
  /** Draw the round background (off when placed on a banner of its own). */
  readonly withBackground = input<boolean>(true);
}
