import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  readonly id: number;
  readonly tone: ToastTone;
  readonly message: string;
}

const DEFAULT_DURATION_MS = 4500;

/** App-wide toasts. Rendered by `<app-toast-host>` placed once in the root component. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly items = signal<readonly Toast[]>([]);

  readonly toasts = this.items.asReadonly();

  show(message: string, tone: ToastTone = 'info', durationMs = DEFAULT_DURATION_MS): number {
    const id = ++this.nextId;
    this.items.update((list) => [...list.slice(-2), { id, tone, message }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), durationMs),
    );
    return id;
  }

  success(message: string): number {
    return this.show(message, 'success');
  }

  error(message: string): number {
    return this.show(message, 'error');
  }

  info(message: string): number {
    return this.show(message, 'info');
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.items.update((list) => list.filter((toast) => toast.id !== id));
  }
}
