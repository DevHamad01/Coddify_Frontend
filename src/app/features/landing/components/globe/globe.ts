import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { GlobeColors, GlobePing, GlobeRenderer } from './globe-renderer';

/**
 * Rotating dotted earth drawn on a canvas. The canvas fills the host; set the host's height.
 * Pauses when scrolled out of view or when the tab is hidden, and draws a single still frame
 * for users who prefer reduced motion. Nothing runs during SSR.
 */
@Component({
  selector: 'app-globe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  templateUrl: './globe.html',
  styleUrl: './globe.scss',
})
export class Globe {
  /** Live-activity dots and chips that pop up on the globe. */
  readonly pings = input<readonly GlobePing[]>([]);
  /** Distance in px from the top of the host to the top of the globe's rim. */
  readonly top = input<number>(96);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    afterNextRender(() => this.start());
  }

  private start(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const renderer = new GlobeRenderer(ctx, this.pings());
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let colors = readColors();
    let visible = true;
    let frameId = 0;
    let last = performance.now();
    let frameCount = 0;

    const draw = (now: number) => {
      // Re-read tokens now and then so a theme switch recolours the globe.
      if (++frameCount % 30 === 0) {
        colors = readColors();
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      renderer.frame(now, dt, this.top(), colors, !reducedMotion);
    };

    const loop = (now: number) => {
      draw(now);
      frameId = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    const resume = () => {
      if (!frameId && visible && !document.hidden && !reducedMotion) {
        last = performance.now();
        frameId = requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      const { width, height } = this.host.nativeElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      renderer.resize(width, height, dpr);
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(this.host.nativeElement);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    intersection.observe(this.host.nativeElement);

    document.addEventListener('visibilitychange', resume);

    resize();
    resume();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', resume);
    });
  }
}

function readColors(): GlobeColors {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => `rgb(${styles.getPropertyValue(`--c-${name}`).trim()})`;
  return {
    dot: token('text-muted'),
    accent: token('primary'),
    sphere: token('surface'),
    chip: token('surface-2'),
    chipText: token('text'),
  };
}
