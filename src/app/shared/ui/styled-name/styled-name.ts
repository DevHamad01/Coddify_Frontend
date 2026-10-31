import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A display name with an unlockable text effect ("teal-glow", "rainbow", "fire"…). */
@Component({
  selector: 'app-styled-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-effect]': 'effect()' },
  templateUrl: './styled-name.html',
  styleUrl: './styled-name.scss',
})
export class StyledName {
  readonly name = input.required<string>();
  readonly effect = input<string>('plain');
}
