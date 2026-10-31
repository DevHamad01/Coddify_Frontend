import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';

import { StoreItem, StoreItemKind } from '../../../../core/gamification/gamification.models';
import { Button } from '../../../../shared/ui/button/button';
import { CosmeticArt } from '../../../../shared/ui/cosmetic-art/cosmetic-art';
import { Modal } from '../../../../shared/ui/modal/modal';

const LIMIT = 5;

const GROUPS: readonly { kind: StoreItemKind; label: string }[] = [
  { kind: 'title', label: 'Titles' },
  { kind: 'frame', label: 'Frames' },
  { kind: 'name-effect', label: 'Name effects' },
  { kind: 'streak-flame', label: 'Streak flames' },
  { kind: 'theme', label: 'Editor themes' },
  { kind: 'tutor', label: 'AI tutors' },
];

/** Pick up to five unlocked cosmetics to pin on the profile; they show in the order picked. */
@Component({
  selector: 'app-showcase-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, CosmeticArt, Modal],
  templateUrl: './showcase-picker.html',
  styleUrl: './showcase-picker.scss',
})
export class ShowcasePicker {
  /** Unlocked items only. */
  readonly items = input.required<readonly StoreItem[]>();
  readonly initial = input<readonly string[]>([]);
  readonly saving = input<boolean>(false);
  readonly saved = output<readonly string[]>();
  readonly closed = output<void>();

  protected readonly limit = LIMIT;
  protected readonly picked = linkedSignal<readonly string[]>(() => this.initial());
  protected readonly groups = computed(() =>
    GROUPS.map((group) => ({
      ...group,
      items: this.items().filter((item) => item.kind === group.kind),
    })).filter((group) => group.items.length),
  );

  protected order(id: string): number {
    return this.picked().indexOf(id) + 1;
  }

  protected toggle(id: string): void {
    this.picked.update((picked) =>
      picked.includes(id)
        ? picked.filter((item) => item !== id)
        : picked.length < LIMIT
          ? [...picked, id]
          : picked,
    );
  }
}
