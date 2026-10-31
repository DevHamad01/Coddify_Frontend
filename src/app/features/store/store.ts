import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { toApiError } from '../../core/api/api-error';
import { GamificationApi } from '../../core/gamification/gamification-api';
import { ProfileItemKind, StoreItem, StoreTab } from '../../core/gamification/gamification.models';
import { ProgressStore } from '../../core/gamification/progress.store';
import { unlockGoal, unlockProgress } from '../../core/gamification/unlock-label';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { CosmeticArt } from '../../shared/ui/cosmetic-art/cosmetic-art';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { ToastService } from '../../shared/ui/toast/toast.service';

const TABS: readonly { id: StoreTab; label: string; icon: IconName; intro: string }[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'user',
    intro: 'Titles, frames, name effects and flames for your profile and the leaderboard.',
  },
  {
    id: 'themes',
    label: 'Editor themes',
    icon: 'layers',
    intro: 'Colour schemes for every code editor in Coddify. Unlock them as you learn.',
  },
  {
    id: 'tutors',
    label: 'AI tutors',
    icon: 'message',
    intro: 'Pick the robot that teaches you. Each has its own style of nudging.',
  },
];

const PROFILE_KINDS: readonly { id: ProfileItemKind; label: string; intro: string }[] = [
  {
    id: 'title',
    label: 'Titles',
    intro: 'Your title shows on your profile and the leaderboard. Let it speak for your coding style!',
  },
  { id: 'frame', label: 'Profile Frames', intro: 'Frames wrap your avatar everywhere it appears.' },
  { id: 'name-effect', label: 'Name Effects', intro: 'Make your name stand out on the leaderboard.' },
  { id: 'streak-flame', label: 'Streak Flames', intro: 'Change the colour of your streak flame.' },
];

/**
 * Cosmetics that unlock through progress: nothing is for sale. Locked items show their goal and
 * how close the learner is, which is the point: practise more, unlock more.
 */
@Component({
  selector: 'app-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CosmeticArt, Icon, PageShell, LevelCard, LeaderboardWidget, MissionsWidget],
  templateUrl: './store.html',
  styleUrl: './store.scss',
})
export class Store {
  private readonly api = inject(GamificationApi);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly store = inject(ProgressStore);

  protected readonly tabs = TABS;
  protected readonly kinds = PROFILE_KINDS;
  protected readonly goal = unlockGoal;
  protected readonly progressLabel = unlockProgress;

  /** `?tab=` keeps the chosen tab in the URL so it survives a refresh. */
  protected readonly tab = signal<StoreTab>(this.initialTab());
  protected readonly kind = signal<ProfileItemKind>('title');
  protected readonly items = signal<readonly StoreItem[] | null>(null);
  protected readonly busyId = signal<string | null>(null);

  protected readonly visibleItems = computed(() => {
    const items = this.items() ?? [];
    return this.tab() === 'profile' ? items.filter((item) => item.kind === this.kind()) : items;
  });
  protected readonly unlockedCount = computed(
    () => this.visibleItems().filter((item) => item.state !== 'locked').length,
  );
  protected readonly intro = computed(() =>
    this.tab() === 'profile'
      ? (this.kinds.find((kind) => kind.id === this.kind())?.intro ?? '')
      : (this.tabs.find((tab) => tab.id === this.tab())?.intro ?? ''),
  );

  constructor() {
    effect(() => {
      const tab = this.tab();
      this.items.set(null);
      this.api.getStore(tab).subscribe((items) => this.items.set(items));
    });
  }

  protected selectTab(tab: StoreTab): void {
    this.tab.set(tab);
    void this.router.navigate([], { queryParams: { tab }, replaceUrl: true });
  }

  protected percent(item: StoreItem): number {
    return item.unlock ? Math.min(100, Math.round((item.progress / item.unlock.target) * 100)) : 100;
  }

  protected equip(item: StoreItem): void {
    this.busyId.set(item.id);
    this.api.equip(item.id).subscribe({
      next: (items) => {
        this.items.set(items);
        this.busyId.set(null);
        this.store.refresh();
        this.toast.success(`${item.name} equipped.`);
      },
      error: (error: unknown) => {
        this.busyId.set(null);
        this.toast.error(toApiError(error).message);
      },
    });
  }

  private initialTab(): StoreTab {
    const tab = inject(ActivatedRoute).snapshot.queryParamMap.get('tab');
    return TABS.some((item) => item.id === tab) ? (tab as StoreTab) : 'profile';
  }
}
