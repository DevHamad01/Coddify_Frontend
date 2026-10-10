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
  styles: `
    .wing {
      transform-box: fill-box;
      transition: transform 250ms ease;
    }
    .blink {
      transform-box: fill-box;
      transform-origin: center;
      animation: blink 5s infinite;
    }
    @keyframes blink {
      0%, 94%, 100% { transform: scaleY(1); }
      96% { transform: scaleY(0.1); }
    }
  `,
  template: `
    <svg
      viewBox="0 0 160 160"
      [attr.width]="size()"
      [attr.height]="size()"
      role="img"
      [attr.aria-label]="ariaLabel()"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="80" cy="152" rx="40" ry="5" fill="#000" opacity="0.18" />

      @if (pose() === 'celebrating') {
        <g fill="#FBBF24">
          <path d="M22 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          <path d="M138 24l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4z" />
          <circle cx="146" cy="70" r="3" />
          <circle cx="14" cy="76" r="2.5" />
        </g>
      }
      @if (pose() === 'thinking') {
        <g fill="#93A1B8">
          <circle cx="128" cy="34" r="4" />
          <circle cx="140" cy="22" r="6" />
          <circle cx="151" cy="8" r="7" opacity="0.8" />
        </g>
      }

      <!-- Ear tufts and the status LED that makes it a circuit owl -->
      <path d="M42 46L34 12l30 22z" fill="#0F8F82" />
      <path d="M118 46l8-34-30 22z" fill="#0F8F82" />
      <path d="M80 24v-9" stroke="#0F8F82" stroke-width="3" stroke-linecap="round" />
      <circle cx="80" cy="12" r="5" fill="#FBBF24" />

      <!-- Wings (behind body when resting, raised when celebrating) -->
      @switch (pose()) {
        @case ('celebrating') {
          <path class="wing" d="M32 84C14 74 8 50 16 36c10 12 22 26 24 42z" fill="#0F8F82" />
          <path class="wing" d="M128 84c18-10 24-34 16-48-10 12-22 26-24 42z" fill="#0F8F82" />
        }
        @default {
          <path class="wing" d="M30 86c-14 12-14 34 2 44 4-14 4-28-2-44z" fill="#0F8F82" />
          <path class="wing" d="M130 86c14 12 14 34-2 44-4-14-4-28 2-44z" fill="#0F8F82" />
        }
      }

      <!-- Body -->
      <path d="M80 22c38 0 56 30 56 66s-24 58-56 58-56-22-56-58 18-66 56-66z" fill="#14B8A6" />

      <!-- Belly with circuit traces -->
      <ellipse cx="80" cy="120" rx="32" ry="22" fill="#5EEAD4" opacity="0.55" />
      <g stroke="#0F766E" stroke-width="2.5" stroke-linecap="round" fill="none">
        <path d="M60 114h12l6 6h12" />
        <path d="M66 128h10l5-5h14" />
        <path d="M88 108v5" />
      </g>
      <g fill="#0F766E">
        <circle cx="60" cy="114" r="3" />
        <circle cx="90" cy="120" r="3" />
        <circle cx="66" cy="128" r="3" />
        <circle cx="95" cy="123" r="3" />
        <circle cx="88" cy="106" r="3" />
      </g>

      <!-- Facial discs -->
      <circle cx="58" cy="72" r="25" fill="#CCFBF1" />
      <circle cx="102" cy="72" r="25" fill="#CCFBF1" />

      <!-- Eyes -->
      @if (pose() === 'celebrating') {
        <g stroke="#0B1220" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M46 76q12-14 24 0" />
          <path d="M90 76q12-14 24 0" />
        </g>
      } @else {
        <g class="blink">
          <circle cx="58" cy="72" r="16" fill="#fff" />
          <circle cx="102" cy="72" r="16" fill="#fff" />
          <circle [attr.cx]="58 + pupil().x" [attr.cy]="72 + pupil().y" r="8.5" fill="#0B1220" />
          <circle [attr.cx]="102 + pupil().x" [attr.cy]="72 + pupil().y" r="8.5" fill="#0B1220" />
          <circle [attr.cx]="61 + pupil().x" [attr.cy]="68 + pupil().y" r="3" fill="#fff" />
          <circle [attr.cx]="105 + pupil().x" [attr.cy]="68 + pupil().y" r="3" fill="#fff" />
        </g>
      }

      <!-- Cheeks and beak -->
      <ellipse cx="40" cy="94" rx="7" ry="4" fill="#FB923C" opacity="0.45" />
      <ellipse cx="120" cy="94" rx="7" ry="4" fill="#FB923C" opacity="0.45" />
      @if (pose() === 'celebrating') {
        <path d="M70 92h20l-10 16z" fill="#FBBF24" />
        <path d="M74 98h12l-6 6z" fill="#B45309" />
      } @else {
        <path d="M80 88l-9 10 9 10 9-10z" fill="#FBBF24" />
      }

      @if (pose() === 'thinking') {
        <!-- Wing raised to the chin -->
        <path d="M118 128c-6-14-22-24-32-22 2 10 14 22 32 22z" fill="#0F8F82" />
      }

      <!-- Feet -->
      <g fill="#FB923C">
        <ellipse cx="66" cy="146" rx="9" ry="4" />
        <ellipse cx="94" cy="146" rx="9" ry="4" />
      </g>
    </svg>
  `,
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
