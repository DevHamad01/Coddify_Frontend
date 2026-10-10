import { DestroyRef, computed, signal } from '@angular/core';

/**
 * Countdown used to rate-limit "resend email" buttons. Create it in an injection context
 * by passing the component's DestroyRef so the timer is cleared on destroy.
 */
export class Cooldown {
  private timer: ReturnType<typeof setInterval> | null = null;
  readonly remaining = signal(0);
  readonly active = computed(() => this.remaining() > 0);

  constructor(destroyRef: DestroyRef) {
    destroyRef.onDestroy(() => this.stop());
  }

  start(seconds = 60): void {
    this.stop();
    this.remaining.set(seconds);
    this.timer = setInterval(() => {
      this.remaining.update((value) => value - 1);
      if (this.remaining() <= 0) {
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.remaining.set(0);
  }
}
