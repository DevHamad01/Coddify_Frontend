import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export type ChipTone = 'neutral' | 'primary' | 'xp' | 'streak' | 'ai' | 'success' | 'danger' | 'info';

const TONES: Record<ChipTone, string> = {
  neutral: 'bg-surface-2 text-text border-border',
  primary: 'bg-primary/10 text-primary border-primary/30',
  xp: 'bg-xp/10 text-xp border-xp/30',
  streak: 'bg-streak/10 text-streak border-streak/30',
  ai: 'bg-ai/10 text-ai border-ai/30',
  success: 'bg-success/10 text-success border-success/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-info/10 text-info border-info/30',
};

/** Small pill label (999px radius) with optional leading icon. */
@Component({
  selector: 'app-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '[class]': 'classes()' },
  template: `
    @if (icon(); as name) {
      <app-icon [name]="name" [size]="14" [filled]="filledIcon()" />
    }
    <ng-content />
  `,
})
export class Chip {
  readonly tone = input<ChipTone>('neutral');
  readonly icon = input<IconName | null>(null);
  readonly filledIcon = input<boolean>(false);

  protected readonly classes = computed(
    () =>
      `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${TONES[this.tone()]}`,
  );
}
