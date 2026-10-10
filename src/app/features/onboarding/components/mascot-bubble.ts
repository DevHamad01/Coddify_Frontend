import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AnimateOnChange } from '../../../shared/ui/animate-on-change/animate-on-change';
import { Mascot, MascotPose } from '../../../shared/ui/mascot/mascot';

/** Mascot with a speech bubble; the text is announced politely when it changes. */
@Component({
  selector: 'app-mascot-bubble',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimateOnChange, Mascot],
  host: { class: 'flex items-end gap-3' },
  template: `
    <app-mascot [pose]="pose()" [size]="size()" class="shrink-0" />
    <p
      class="relative mb-4 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-sm"
      aria-live="polite"
    >
      <span class="block" [appAnimateOnChange]="text()">{{ text() }}</span>
    </p>
  `,
})
export class MascotBubble {
  readonly pose = input<MascotPose>('happy');
  readonly text = input.required<string>();
  readonly size = input<number>(88);
}
