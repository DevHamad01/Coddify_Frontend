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
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { ToastService } from '../../shared/ui/toast/toast.service';

const TABS: readonly { id: StoreTab; label: string; icon: IconName }[] = [
  { id: 'boosts', label: 'Boosts', icon: 'bolt' },
  { id: 'themes', label: 'Editor themes', icon: 'layers' },
  { id: 'tutors', label: 'AI tutors', icon: 'message' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

const PROFILE_KINDS: readonly { id: ProfileItemKind; label: string; intro: string }[] = [
  {
    id: 'title',
    label: 'Titles',
    intro:
      'Your title shows up on your profile and leaderboard. Let it speak for your coding style!',
  },
  { id: 'frame', label: 'Profile Frames', intro: 'Frames wrap your avatar everywhere it appears.' },
  {
    id: 'name-effect',
    label: 'Name Effects',
    intro: 'Make your name stand out on the leaderboard.',
  },
  { id: 'streak-flame', label: 'Streak Flames', intro: 'Change the colour of your streak flame.' },
];

/** Art keys from the API mapped to what we draw for them. */
const ICON_ART: Partial<Record<string, IconName>> = {
  code: 'code',
  infinity: 'infinity',
  moon: 'moon',
  frame: 'user',
  sparkles: 'sparkles',
  snowflake: 'snowflake',
  bolt: 'bolt',
};

/** Spend gems on boosts, editor themes, tutor personalities and profile cosmetics. */
@Component({
  selector: 'app-store',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    Mascot,
    NavArt,
    PageShell,
    LevelCard,
    PromoCard,
    LeaderboardWidget,
    MissionsWidget,
  ],
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
  protected readonly iconArt = ICON_ART;

  /** `?tab=` keeps the chosen tab in the URL so it survives a refresh. */
  protected readonly tab = signal<StoreTab>(
    (inject(ActivatedRoute).snapshot.queryParamMap.get('tab') as StoreTab | null) ?? 'profile',
  );
  protected readonly kind = signal<ProfileItemKind>('title');
  protected readonly items = signal<readonly StoreItem[] | null>(null);
  protected readonly busyId = signal<string | null>(null);

  protected readonly visibleItems = computed(() => {
    const items = this.items() ?? [];
    return this.tab() === 'profile' ? items.filter((item) => item.kind === this.kind()) : items;
  });
  protected readonly intro = computed(
    () => this.kinds.find((kind) => kind.id === this.kind())?.intro ?? '',
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

  protected equip(item: StoreItem): void {
    this.busyId.set(item.id);
    this.api.equip(item.id).subscribe({
      next: (items) => {
        this.items.set(items);
        this.busyId.set(null);
        this.toast.success(`${item.name} equipped.`);
      },
      error: (error: unknown) => this.fail(error),
    });
  }

  protected buy(item: StoreItem): void {
    this.busyId.set(item.id);
    this.api.buy(item.id).subscribe({
      next: (items) => {
        this.items.set(items);
        this.busyId.set(null);
        this.store.addGems(-(item.price ?? 0));
        this.toast.success(`You bought ${item.name}!`);
      },
      error: (error: unknown) => this.fail(error),
    });
  }

  private fail(error: unknown): void {
    this.busyId.set(null);
    this.toast.show(toApiError(error).message, 'error');
  }
}
