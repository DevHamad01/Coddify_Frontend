import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Two-column landing section: copy on one side, a mock UI on the other.
 * `reverse` puts the visual first on desktop (zig-zag rhythm); on mobile copy always comes first.
 * `band` gives the section the tinted background used on alternating sections.
 */
@Component({
  selector: 'app-feature-split',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block section scroll-mt-16', '[class.section-band]': 'band()' },
  templateUrl: './feature-split.html',
  styleUrl: './feature-split.scss',
})
export class FeatureSplit {
  readonly heading = input.required<string>();
  readonly lead = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly reverse = input<boolean>(false);
  readonly band = input<boolean>(false);
}
