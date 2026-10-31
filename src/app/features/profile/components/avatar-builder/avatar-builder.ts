import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';

import {
  AVATAR_BACKGROUNDS,
  AvatarLook,
  HAIR_COLORS,
  HAIR_STYLES,
  SHIRT_COLORS,
  SKIN_TONES,
} from '../../../../shared/data/avatar-parts';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import { PersonAvatar } from '../../../../shared/ui/person-avatar/person-avatar';

const HAIR_LABEL: Record<AvatarLook['hair'], string> = {
  short: 'Short',
  curly: 'Curly',
  long: 'Long',
  bun: 'Bun',
  none: 'None',
};

/**
 * First version of the avatar builder: skin, hair, shirt, glasses and background with a live
 * preview. Faces, outfits and accessories come with the full builder later.
 */
@Component({
  selector: 'app-avatar-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Modal, PersonAvatar],
  templateUrl: './avatar-builder.html',
  styleUrl: './avatar-builder.scss',
})
export class AvatarBuilder {
  readonly initial = input.required<AvatarLook>();
  readonly saving = input<boolean>(false);
  readonly saved = output<AvatarLook>();
  readonly closed = output<void>();

  protected readonly look = linkedSignal<AvatarLook>(() => this.initial());
  protected readonly skins = SKIN_TONES;
  protected readonly hairStyles = HAIR_STYLES;
  protected readonly hairLabels = HAIR_LABEL;
  protected readonly hairColors = HAIR_COLORS;
  protected readonly shirts = SHIRT_COLORS;
  protected readonly backgrounds = AVATAR_BACKGROUNDS;

  protected set<K extends keyof AvatarLook>(key: K, value: AvatarLook[K]): void {
    this.look.update((look) => ({ ...look, [key]: value }));
  }
}
