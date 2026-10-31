import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChildren,
} from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export interface PillTab {
  readonly id: string;
  readonly label: string;
  readonly icon?: IconName;
}

/**
 * Pill-shaped tab list (WAI-ARIA tabs with automatic activation). The parent renders the
 * panel with `id="{{idPrefix}}-panel"` and `aria-labelledby="{{idPrefix}}-tab-{{selected}}"`.
 */
@Component({
  selector: 'app-pill-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './pill-tabs.html',
  styleUrl: './pill-tabs.scss',
})
export class PillTabs {
  readonly tabs = input.required<readonly PillTab[]>();
  readonly idPrefix = input.required<string>();
  readonly label = input.required<string>();
  readonly selected = model.required<string>();

  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const count = this.tabs().length;
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    this.selected.set(this.tabs()[next].id);
    this.buttons()[next]?.nativeElement.focus();
  }
}
