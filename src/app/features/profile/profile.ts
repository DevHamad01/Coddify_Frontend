import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { toApiError } from '../../core/api/api-error';
import { GamificationApi } from '../../core/gamification/gamification-api';
import { ProfileSummary, StoreItem } from '../../core/gamification/gamification.models';
import { ProgressStore } from '../../core/gamification/progress.store';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { AvatarLook } from '../../shared/data/avatar-parts';
import { AvatarFrame } from '../../shared/ui/avatar-frame/avatar-frame';
import { CosmeticArt } from '../../shared/ui/cosmetic-art/cosmetic-art';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { Mascot } from '../../shared/ui/mascot/mascot';
import { NavArt } from '../../shared/ui/nav-art/nav-art';
import { PersonAvatar } from '../../shared/ui/person-avatar/person-avatar';
import { StreakFlame } from '../../shared/ui/streak-flame/streak-flame';
import { StyledName } from '../../shared/ui/styled-name/styled-name';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AvatarBuilder } from './components/avatar-builder/avatar-builder';
import { ProfileMenu } from './components/profile-menu/profile-menu';
import { ShowcasePicker } from './components/showcase-picker/showcase-picker';
import { TitlePicker } from './components/title-picker/title-picker';

/** How many not-yet-earned badges to show: enough to motivate, not a wall of grey. */
const UPCOMING_BADGES = 5;

const SOCIAL_ICONS: Readonly<Partial<Record<string, IconName>>> = {
  linkedin: 'linkedin',
  github: 'git-branch',
  twitter: 'x',
  facebook: 'users',
  instagram: 'instagram',
  youtube: 'youtube',
  website: 'globe',
};

type Dialog = 'title' | 'showcase' | 'avatar' | null;

/** The learner's own profile: avatar, title, showcase, stats, levels, collection and badges. */
@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AvatarFrame,
    CosmeticArt,
    Icon,
    Mascot,
    NavArt,
    PersonAvatar,
    StreakFlame,
    StyledName,
    PageShell,
    LevelCard,
    ProfileMenu,
    TitlePicker,
    ShowcasePicker,
    AvatarBuilder,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly api = inject(GamificationApi);
  private readonly toast = inject(ToastService);
  protected readonly store = inject(ProgressStore);

  protected readonly profile = signal<ProfileSummary | null>(null);
  protected readonly dialog = signal<Dialog>(null);
  protected readonly collection = signal<readonly StoreItem[]>([]);
  protected readonly busy = signal<string | null>(null);
  protected readonly socialIcons = SOCIAL_ICONS;

  protected readonly titles = computed(() =>
    this.collection().filter((item) => item.kind === 'title'),
  );
  protected readonly unlocked = computed(() =>
    this.collection().filter((item) => item.state !== 'locked'),
  );
  protected readonly titleItem = computed(() =>
    this.titles().find((item) => item.id === this.profile()?.equipped.title),
  );
  protected readonly showcaseIds = computed(() =>
    (this.profile()?.showcase ?? []).map((item) => item.id),
  );
  protected readonly socials = computed(() =>
    Object.entries(this.profile()?.socials ?? {}).filter(([, url]) => !!url),
  );

  /** Badges closest to being earned first; earned ones are counted, not listed. */
  protected readonly upcomingBadges = computed(() =>
    (this.profile()?.badges ?? [])
      .filter((badge) => badge.progress < badge.target)
      .sort((a, b) => b.progress / b.target - a.progress / a.target)
      .slice(0, UPCOMING_BADGES),
  );
  protected readonly earnedBadges = computed(
    () => (this.profile()?.badges ?? []).filter((badge) => badge.progress >= badge.target).length,
  );

  constructor() {
    this.api.getProfile().subscribe((profile) => this.profile.set(profile));
    this.loadCollection();
  }

  protected share(): void {
    this.toast.success('Profile link copied!');
  }

  protected percent(progress: number, target: number): number {
    return Math.round((progress / target) * 100);
  }

  protected chooseTitle(title: StoreItem): void {
    this.busy.set(title.id);
    this.api
      .equip(title.id)
      .pipe(finalize(() => this.busy.set(null)))
      .subscribe({
        next: () => {
          this.toast.success(`${title.name} equipped.`);
          this.dialog.set(null);
          this.reload();
        },
        error: (error: unknown) => this.toast.error(toApiError(error).message),
      });
  }

  protected saveShowcase(itemIds: readonly string[]): void {
    this.busy.set('showcase');
    this.api
      .setShowcase(itemIds)
      .pipe(finalize(() => this.busy.set(null)))
      .subscribe((profile) => {
        this.profile.set(profile);
        this.dialog.set(null);
        this.toast.success('Showcase saved.');
      });
  }

  protected saveAvatar(look: AvatarLook): void {
    this.busy.set('avatar');
    this.api
      .setAvatar(look)
      .pipe(finalize(() => this.busy.set(null)))
      .subscribe((profile) => {
        this.profile.set(profile);
        this.dialog.set(null);
        this.toast.success('Avatar saved.');
      });
  }

  private reload(): void {
    this.api.getProfile().subscribe((profile) => this.profile.set(profile));
    this.loadCollection();
    this.store.refresh();
  }

  private loadCollection(): void {
    this.api.getCollection().subscribe((items) => this.collection.set(items));
  }
}
