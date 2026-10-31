import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AnimateOnChange } from '../../../../shared/ui/animate-on-change/animate-on-change';
import { Mascot, MascotPose } from '../../../../shared/ui/mascot/mascot';

/** Mascot with a speech bubble; the text is announced politely when it changes. */
@Component({
  selector: 'app-mascot-bubble',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnChange, Mascot],
  host: { class: 'flex items-end gap-3' },
  templateUrl: './mascot-bubble.html',
  styleUrl: './mascot-bubble.scss',
})
export class MascotBubble {
  readonly pose = input<MascotPose>('happy');
  readonly text = input.required<string>();
  readonly size = input<number>(88);
}
