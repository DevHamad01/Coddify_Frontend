import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { GamificationApi } from '../../../core/gamification/gamification-api';
import { LevelCard } from '../../../layouts/app-layout/rail/level-card/level-card';
import { PageShell } from '../../../layouts/app-layout/page-shell/page-shell';
import { Icon } from '../../../shared/ui/icon/icon';
import { ProfileMenu } from '../components/profile-menu/profile-menu';

/** Circumference of the progress ring (r = 52). */
const RING = 2 * Math.PI * 52;

/** The level ladder: current level ring, then every tier with its levels and rewards. */
@Component({
  selector: 'app-levels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageShell, LevelCard, ProfileMenu],
  templateUrl: './levels.html',
  styleUrl: './levels.scss',
})
export class Levels {
  protected readonly summary = toSignal(inject(GamificationApi).getLevels());
  protected readonly ring = RING;
  /** Tiers the learner has expanded; the current tier starts open. */
  protected readonly openTiers = signal<ReadonlySet<string> | null>(null);

  protected readonly ringOffset = computed(() => {
    const summary = this.summary();
    return summary ? RING * (1 - summary.xpIntoLevel / summary.xpForLevel) : RING;
  });
  protected readonly reachedCount = computed(
    () =>
      this.summary()
        ?.tiers.flatMap((tier) => tier.levels)
        .filter((level) => level.reached).length ?? 0,
  );
  protected readonly totalLevels = computed(
    () => this.summary()?.tiers.reduce((sum, tier) => sum + tier.levels.length, 0) ?? 0,
  );

  protected isOpen(tierName: string): boolean {
    return (this.openTiers() ?? new Set([this.summary()?.tierName ?? ''])).has(tierName);
  }

  protected toggle(tierName: string): void {
    const open = new Set(this.openTiers() ?? [this.summary()?.tierName ?? '']);
    if (open.has(tierName)) {
      open.delete(tierName);
    } else {
      open.add(tierName);
    }
    this.openTiers.set(open);
  }

  protected reachedIn(levels: readonly { reached: boolean }[]): number {
    return levels.filter((level) => level.reached).length;
  }
}
