import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';

export type ChangeAnimation = 'fade-up' | 'slide-forward' | 'slide-back';

const FRAMES: Record<ChangeAnimation, Keyframe[]> = {
  'fade-up': [
    { opacity: 0, transform: 'translateY(6px)' },
    { opacity: 1, transform: 'none' },
  ],
  'slide-forward': [
    { opacity: 0, transform: 'translateX(24px)' },
    { opacity: 1, transform: 'none' },
  ],
  'slide-back': [
    { opacity: 0, transform: 'translateX(-24px)' },
    { opacity: 1, transform: 'none' },
  ],
};

/**
 * Replays a short entrance animation whenever the bound key changes, without re-creating
 * the element. Skipped on the server, on first render and for reduced-motion users.
 * Usage: `<div [appAnimateOnChange]="step()" animateWith="slide-forward">`.
 */
@Directive({ selector: '[appAnimateOnChange]' })
export class AnimateOnChange {
  readonly appAnimateOnChange = input.required<unknown>();
  readonly animateWith = input<ChangeAnimation>('fade-up');

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    let firstRun = true;

    effect(() => {
      this.appAnimateOnChange();
      if (firstRun || !isBrowser) {
        firstRun = false;
        return;
      }
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && typeof element.animate === 'function') {
        element.animate(FRAMES[untracked(this.animateWith)], { duration: 250, easing: 'ease-out' });
      }
    });
  }
}
