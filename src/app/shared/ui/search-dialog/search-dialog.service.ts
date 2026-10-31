import { Injectable, signal } from '@angular/core';

/** Opens and closes the global Ctrl+K search dialog from anywhere (navbar, sidebar, shortcut). */
@Injectable({ providedIn: 'root' })
export class SearchDialogService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
