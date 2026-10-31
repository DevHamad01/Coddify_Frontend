import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GamificationApi } from '../../core/gamification/gamification-api';
import { Leaderboard as Board } from '../../core/gamification/gamification.models';
import { InfoCard } from '../../layouts/app-layout/rail/info-card/info-card';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { ToastService } from '../../shared/ui/toast/toast.service';

type Tab = 'league' | 'friends' | 'squad';

/** Weekly league table, friends ranking and squads (create or join with a code). */
@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Avatar, Button, Icon, PageShell, LevelCard, PromoCard, InfoCard],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
})
export class Leaderboard {
  private readonly api = inject(GamificationApi);
  private readonly toast = inject(ToastService);

  protected readonly tabs: readonly { id: Tab; label: string }[] = [
    { id: 'league', label: 'League' },
    { id: 'friends', label: 'Friends' },
    { id: 'squad', label: 'Squad' },
  ];
  protected readonly tab = signal<Tab>('league');
  protected readonly board = signal<Board | null>(null);
  protected readonly squadName = signal('');
  protected readonly squadCode = signal('');

  constructor() {
    effect(() => {
      const tab = this.tab();
      if (tab === 'squad') {
        return;
      }
      this.board.set(null);
      this.api.getLeaderboard(tab).subscribe((board) => this.board.set(board));
    });
  }

  protected createSquad(): void {
    this.toast.success(
      `Squad "${this.squadName().trim()}" created. Share code SQ-${Math.floor(1000 + Math.random() * 9000)}.`,
    );
    this.squadName.set('');
  }

  protected joinSquad(): void {
    this.toast.show(`No squad found with code ${this.squadCode().trim().toUpperCase()}.`, 'error');
  }

  protected invite(): void {
    this.toast.success('Invite link copied!');
  }
}
