import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { SEARCH_INDEX, SearchItem } from '../../data/search-index';
import { Icon } from '../icon/icon';
import { TechLogo } from '../tech-logo/tech-logo';
import { SearchDialogService } from './search-dialog.service';

const MAX_RESULTS = 8;

/**
 * Command-palette style search. Mounted once in the app root; Ctrl/Cmd+K toggles it,
 * arrows move through results, Enter opens one, Escape closes.
 */
@Component({
  selector: 'app-search-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TechLogo],
  host: { '(document:keydown)': 'onGlobalKey($event)' },
  templateUrl: './search-dialog.html',
  styleUrl: './search-dialog.scss',
})
export class SearchDialog {
  protected readonly dialog = inject(SearchDialogService);
  private readonly router = inject(Router);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);
  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = q
      ? SEARCH_INDEX.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q))
      : SEARCH_INDEX.filter((item) => item.group === 'Pages' || item.id === 'course-python');
    return items.slice(0, MAX_RESULTS);
  });

  constructor() {
    effect(() => {
      if (this.dialog.isOpen()) {
        this.query.set('');
        this.activeIndex.set(0);
        queueMicrotask(() => this.input()?.nativeElement.focus());
      }
    });
  }

  protected onGlobalKey(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.dialog.isOpen.update((open) => !open);
    }
  }

  protected onInputKey(event: KeyboardEvent): void {
    const count = this.results().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex.update((i) => (count ? (i + delta + count) % count : 0));
    } else if (event.key === 'Enter') {
      const item = this.results()[this.activeIndex()];
      if (item) {
        this.go(item);
      }
    } else if (event.key === 'Escape') {
      this.dialog.close();
    }
  }

  protected onQuery(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected go(item: SearchItem): void {
    this.dialog.close();
    void this.router.navigate([item.path], { queryParams: item.queryParams });
  }
}
