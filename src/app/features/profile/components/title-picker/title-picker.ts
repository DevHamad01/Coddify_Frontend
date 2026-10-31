import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { StoreItem } from '../../../../core/gamification/gamification.models';
import { unlockGoal } from '../../../../core/gamification/unlock-label';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { Modal } from '../../../../shared/ui/modal/modal';

/** "Your title": every title, unlocked ones selectable, locked ones show their goal. */
@Component({
  selector: 'app-title-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Mascot, Modal],
  templateUrl: './title-picker.html',
  styleUrl: './title-picker.scss',
})
export class TitlePicker {
  readonly titles = input.required<readonly StoreItem[]>();
  readonly busyId = input<string | null>(null);
  readonly chosen = output<StoreItem>();
  readonly closed = output<void>();

  protected readonly goal = unlockGoal;
  protected readonly unlocked = computed(
    () => this.titles().filter((title) => title.state !== 'locked').length,
  );

  protected icon(title: StoreItem): IconName {
    return title.art as IconName;
  }
}
