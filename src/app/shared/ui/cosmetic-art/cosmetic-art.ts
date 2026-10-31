import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { StoreItem } from '../../../core/gamification/gamification.models';
import { EDITOR_THEMES } from '../../data/editor-themes';
import { AvatarFrame } from '../avatar-frame/avatar-frame';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { Mascot } from '../mascot/mascot';
import { PersonAvatar } from '../person-avatar/person-avatar';
import { StreakFlame } from '../streak-flame/streak-flame';
import { StyledName } from '../styled-name/styled-name';
import { TutorBot } from '../tutor-bot/tutor-bot';

/** Preview of a store item: editor swatch, tutor robot, title icon, framed avatar, name or flame. */
@Component({
  selector: 'app-cosmetic-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarFrame, Icon, Mascot, PersonAvatar, StreakFlame, StyledName, TutorBot],
  host: { '[class.is-locked]': "item().state === 'locked'" },
  templateUrl: './cosmetic-art.html',
  styleUrl: './cosmetic-art.scss',
})
export class CosmeticArt {
  private readonly auth = inject(AuthService);

  readonly item = input.required<StoreItem>();
  readonly size = input<number>(56);

  protected readonly firstName = computed(
    () => this.auth.user()?.fullName.split(' ')[0] ?? 'You',
  );
  protected readonly palette = computed(() => EDITOR_THEMES[this.item().id]);
  protected readonly icon = computed(() => this.item().art as IconName);
}
