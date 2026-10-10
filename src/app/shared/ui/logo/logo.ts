import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Owl-face mark + "Coddify" wordmark. Links home unless `link` is false. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (link()) {
      <a
        routerLink="/"
        class="inline-flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Coddify home"
      >
        <ng-container *ngTemplateOutlet="mark" />
      </a>
    } @else {
      <span class="inline-flex items-center gap-2"><ng-container *ngTemplateOutlet="mark" /></span>
    }
    <ng-template #mark>
      <svg viewBox="0 0 40 40" width="32" height="32" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#14B8A6" />
        <path d="M9 13L7 4l8 5zM31 13l2-9-8 5z" fill="#0F8F82" />
        <circle cx="14" cy="20" r="7" fill="#CCFBF1" />
        <circle cx="26" cy="20" r="7" fill="#CCFBF1" />
        <circle cx="14.5" cy="20.5" r="3.4" fill="#0B1220" />
        <circle cx="25.5" cy="20.5" r="3.4" fill="#0B1220" />
        <path d="M20 26l-3 3.5 3 3.5 3-3.5z" fill="#FBBF24" />
      </svg>
      @if (showWordmark()) {
        <span class="font-display text-xl font-extrabold tracking-tight text-text">
          Codd<span class="text-primary">ify</span>
        </span>
      }
    </ng-template>
  `,
})
export class Logo {
  readonly link = input<boolean>(true);
  readonly showWordmark = input<boolean>(true);
}
