import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProgressStore } from '../../../../core/gamification/progress.store';
import { NavArt } from '../../../../shared/ui/nav-art/nav-art';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { CoursePopover } from './course-popover/course-popover';
import { GemsPopover } from './gems-popover/gems-popover';
import { StreakPopover } from './streak-popover/streak-popover';

type Panel = 'course' | 'streak' | 'gems';

/** Grace period so the pointer can travel from a stat down into its popover. */
const CLOSE_DELAY_MS = 180;

/**
 * Current course, streak and gems. Hovering (or clicking) a stat opens its popover:
 * my journeys, this week's streak, or the gem balance.
 */
@Component({
  selector: 'app-stats-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavArt, TechLogo, CoursePopover, StreakPopover, GemsPopover],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open.set(null)',
  },
  templateUrl: './stats-bar.html',
  styleUrl: './stats-bar.scss',
})
export class StatsBar {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly store = inject(ProgressStore);
  protected readonly open = signal<Panel | null>(null);
  private closeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(null));
  }

  protected hover(panel: Panel): void {
    clearTimeout(this.closeTimer);
    this.open.set(panel);
  }

  protected leave(): void {
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.open.set(null), CLOSE_DELAY_MS);
  }

  protected toggle(panel: Panel): void {
    clearTimeout(this.closeTimer);
    this.open.update((current) => (current === panel ? null : panel));
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(null);
    }
  }
}
