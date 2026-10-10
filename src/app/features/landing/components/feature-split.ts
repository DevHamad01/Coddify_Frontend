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
  template: `
    <div class="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div class="flex flex-col gap-5" [class]="reverse() ? 'lg:order-2' : ''">
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h2 class="text-balance text-[32px] font-bold leading-[1.1] sm:text-[44px] lg:text-[52px]">
          {{ heading() }}
        </h2>
        <p class="max-w-xl text-lg leading-8 text-muted">{{ lead() }}</p>
        <ng-content select="[copy]" />
      </div>
      <div class="flex justify-center" [class]="reverse() ? 'lg:order-1' : ''">
        <ng-content select="[visual]" />
      </div>
    </div>
  `,
})
export class FeatureSplit {
  readonly heading = input.required<string>();
  readonly lead = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly reverse = input<boolean>(false);
  readonly band = input<boolean>(false);
}
