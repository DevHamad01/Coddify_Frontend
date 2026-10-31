import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MascotPose = 'happy' | 'thinking' | 'celebrating';

/**
 * "Owlbit", Coddify's original circuit-owl mascot, drawn as inline SVG.
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

  protected readonly pupil = computed(() =>
    this.pose() === 'thinking' ? { x: 4, y: -5 } : { x: 0, y: 1 },
  );
  protected readonly ariaLabel = computed(
    () => this.label() || `Owlbit the Coddify owl, ${this.pose()}`,
  );
}
