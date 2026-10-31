import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

const formatter = new Intl.NumberFormat('en-US');

/**
 * Animates a number from 0 to `appCountUp` once the element scrolls into view.
 * The server renders the final value (good for SEO and no-JS); reduced-motion users see it unchanged.
 */
@Directive({
  selector: '[appCountUp]',
  host: { '[textContent]': 'initialText()' },
})
export class CountUp {
  readonly appCountUp = input.required<number>();
  readonly duration = input<number>(1400);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private frame = 0;
  private observer?: IntersectionObserver;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.isBrowser) {
        cancelAnimationFrame(this.frame);
        this.observer?.disconnect();
      }
    });
    afterNextRender(() => this.start());
  }

  protected initialText(): string {
    return formatter.format(this.appCountUp());
  }

  private start(): void {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!this.isBrowser || reduced || typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        this.observer?.disconnect();
        this.animate();
      }
    });
    this.observer.observe(this.el.nativeElement);
  }

  private animate(): void {
    const target = this.appCountUp();
    const begin = performance.now();
    const step = (now: number): void => {
      // rAF timestamps can be slightly older than `begin`; clamp so the first frame is never negative.
      const progress = Math.min(1, Math.max(0, (now - begin) / this.duration()));
      const eased = 1 - Math.pow(1 - progress, 3);
      this.el.nativeElement.textContent = formatter.format(Math.round(target * eased));
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }
}
