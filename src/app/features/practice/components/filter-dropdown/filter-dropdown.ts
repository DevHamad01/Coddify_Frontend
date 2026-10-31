import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

/** "Language (2) ▾" button with a checkbox list; an empty selection means "all". */
@Component({
  selector: 'app-filter-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.scss',
})
export class FilterDropdown {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly label = input.required<string>();
  readonly options = input.required<readonly FilterOption[]>();
  readonly selected = model<readonly string[]>([]);

  protected readonly open = signal(false);
  protected readonly buttonLabel = computed(() =>
    this.selected().length ? `${this.label()} (${this.selected().length})` : this.label(),
  );

  protected toggle(value: string): void {
    this.selected.update((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
