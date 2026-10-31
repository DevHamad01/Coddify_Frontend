import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AuthService } from '../../../../core/auth/auth.service';
import { StoreItem } from '../../../../core/gamification/gamification.models';
import { EDITOR_THEMES } from '../../../../shared/data/editor-themes';
import { Avatar } from '../../../../shared/ui/avatar/avatar';
import { AvatarFrame } from '../../../../shared/ui/avatar-frame/avatar-frame';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { StreakFlame } from '../../../../shared/ui/streak-flame/streak-flame';
import { StyledName } from '../../../../shared/ui/styled-name/styled-name';
import { TutorBot } from '../../../../shared/ui/tutor-bot/tutor-bot';

/** Preview of a store item: editor swatch, tutor robot, title icon, framed avatar, name or flame. */
@Component({
  selector: 'app-store-item-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarFrame, Icon, Mascot, StreakFlame, StyledName, TutorBot],
  host: { '[class.is-locked]': "item().state === 'locked'" },
  templateUrl: './store-item-art.html',
  styleUrl: './store-item-art.scss',
})
export class StoreItemArt {
  private readonly auth = inject(AuthService);

  readonly item = input.required<StoreItem>();
  readonly size = input<number>(56);

  protected readonly fullName = computed(() => this.auth.user()?.fullName ?? 'Coddify learner');
  protected readonly firstName = computed(() => this.fullName().split(' ')[0]);
  protected readonly palette = computed(() => EDITOR_THEMES[this.item().id]);
  protected readonly icon = computed(() => this.item().art as IconName);
}
