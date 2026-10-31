import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { GamificationApi } from '../../../core/gamification/gamification-api';
import { StoreItem, StoreItemKind } from '../../../core/gamification/gamification.models';
import { unlockGoal, unlockProgress } from '../../../core/gamification/unlock-label';
import { LevelCard } from '../../../layouts/app-layout/rail/level-card/level-card';
import { PageShell } from '../../../layouts/app-layout/page-shell/page-shell';
import { CosmeticArt } from '../../../shared/ui/cosmetic-art/cosmetic-art';
import { Icon } from '../../../shared/ui/icon/icon';
import { ProfileMenu } from '../components/profile-menu/profile-menu';

const KINDS: readonly { id: StoreItemKind; label: string }[] = [
  { id: 'title', label: 'Titles' },
  { id: 'frame', label: 'Frames' },
  { id: 'name-effect', label: 'Names' },
  { id: 'streak-flame', label: 'Flames' },
  { id: 'theme', label: 'Themes' },
  { id: 'tutor', label: 'Tutors' },
];

/** Every collectible by type; tap one to see what it is and how to unlock it. */
@Component({
  selector: 'app-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CosmeticArt, Icon, PageShell, LevelCard, ProfileMenu],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection {
  protected readonly items = toSignal(inject(GamificationApi).getCollection());
  protected readonly kinds = KINDS;
  protected readonly kind = signal<StoreItemKind>('title');
  protected readonly selected = signal<StoreItem | null>(null);
  protected readonly goal = unlockGoal;
  protected readonly progressLabel = unlockProgress;

  protected readonly visible = computed(() =>
    (this.items() ?? []).filter((item) => item.kind === this.kind()),
  );

  protected count(kind: StoreItemKind): string {
    const items = (this.items() ?? []).filter((item) => item.kind === kind);
    return `${items.filter((item) => item.state !== 'locked').length} / ${items.length}`;
  }

  protected selectKind(kind: StoreItemKind): void {
    this.kind.set(kind);
    this.selected.set(null);
  }
}
