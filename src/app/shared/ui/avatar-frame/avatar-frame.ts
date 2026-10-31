import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Wraps an avatar in an unlockable profile frame ("copper", "prism", "aurora"…).
 * `<app-avatar-frame frame="gold" [size]="64"><app-avatar … /></app-avatar-frame>`
 */
@Component({
  selector: 'app-avatar-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-frame]': 'frame()',
    '[style.--size.px]': 'size()',
  },
  templateUrl: './avatar-frame.html',
  styleUrl: './avatar-frame.scss',
})
export class AvatarFrame {
  readonly frame = input<string>('none');
  readonly size = input<number>(48);
}
