import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ThemePreference, ThemeService } from '../../../core/theme/theme.service';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

const OPTIONS: readonly { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'system', label: 'System', icon: 'monitor' },
];

/**
 * `compact`: one square button cycling dark → light → system (navbar).
 * `segmented`: a radio group showing all three choices (mobile drawer, settings).
 */
@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  readonly mode = input<'compact' | 'segmented'>('compact');

  protected readonly theme = inject(ThemeService);
  protected readonly options = OPTIONS;
  protected readonly current = computed(
    () => OPTIONS.find((option) => option.value === this.theme.preference()) ?? OPTIONS[2],
  );
}
