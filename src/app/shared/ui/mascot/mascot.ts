import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MascotPose = 'happy' | 'waving' | 'thinking' | 'celebrating' | 'peeking';

let nextId = 0;

/**
 * "Bit", Coddify's robot mascot, drawn as inline SVG and animated with CSS:
 * the head looks around, the visor eyes blink and the antenna LED pulses.
 * `peeking` draws only the head and two gripping hands, for placing it over an edge.
 * Colours are fixed brand colours (not theme tokens) so the character looks the same everywhere.
 */
@Component({
  selector: 'app-mascot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  templateUrl: './mascot.html',
  styleUrl: './mascot.scss',
})
export class Mascot {
  readonly pose = input<MascotPose>('happy');
  readonly size = input<number>(120);
  readonly label = input<string>('');
  /** false renders a still pose (thumbnails, reduced clutter). */
  readonly animated = input<boolean>(true);

  /** Gradient ids must be unique per instance or two robots on a page share one gradient. */
  protected readonly uid = `bot-${nextId++}`;

  protected readonly hasBody = computed(() => this.pose() !== 'peeking');
  protected readonly happyEyes = computed(
    () => this.pose() === 'celebrating' || this.pose() === 'waving',
  );
  protected readonly ariaLabel = computed(
    () => this.label() || `Bit the Coddify robot, ${this.pose()}`,
  );
}
