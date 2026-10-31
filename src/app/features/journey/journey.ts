import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { finalize } from 'rxjs';

import { ProgressStore } from '../../core/gamification/progress.store';
import { LearningApi } from '../../core/learning/learning-api';
import { Journey as JourneyData, JourneyNode } from '../../core/learning/learning.models';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { DailyGoalModal } from '../../shared/ui/daily-goal-modal/daily-goal-modal';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { NodePopover } from './components/node-popover/node-popover';
import { PathNode } from './components/path-node/path-node';
import { SyllabusHeader } from './components/syllabus-header/syllabus-header';

/** Horizontal offsets (px from the centre line) that make the path zig-zag. */
const OFFSETS = [0, 56, 0, -56];
const ROW_HEIGHT = 112;
const PATH_WIDTH = 320;
/** A chapter counts as "in view" once its top passes this far below the viewport top. */
const HEADER_LINE = 240;

interface PlacedNode {
  readonly node: JourneyNode;
  readonly x: number;
  readonly y: number;
}

/** The learning path: chapters of hexagon nodes, the current one ready to start. */
@Component({
  selector: 'app-journey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShell,
    SyllabusHeader,
    PathNode,
    NodePopover,
    LevelCard,
    LeaderboardWidget,
    MissionsWidget,
    DailyGoalModal,
  ],
  host: {
    '(document:keydown.escape)': 'selectedId.set(null)',
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onScroll()',
  },
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class Journey {
  private readonly api = inject(LearningApi);
  protected readonly store = inject(ProgressStore);
  private readonly toast = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly pathWidth = PATH_WIDTH;
  protected readonly journey = signal<JourneyData | null>(null);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly claiming = signal(false);
  protected readonly error = signal(false);
  protected readonly goalOpen = signal(false);
  protected readonly savingGoal = signal(false);
  /** Chapter scrolled into view; null until the first scroll, then the header follows it. */
  private readonly visibleChapterId = signal<string | null>(null);

  protected readonly currentChapter = computed(() => {
    const chapters = this.journey()?.chapters ?? [];
    return (
      chapters.find((chapter) => chapter.nodes.some((node) => node.state === 'current')) ??
      chapters[chapters.length - 1]
    );
  });
  protected readonly headerChapter = computed(() => {
    const id = this.visibleChapterId();
    return this.journey()?.chapters.find((chapter) => chapter.id === id) ?? this.currentChapter();
  });

  /** Node coordinates and the SVG path joining them, per chapter. */
  protected readonly layout = computed(() =>
    (this.journey()?.chapters ?? []).map((chapter) => {
      const placed: PlacedNode[] = chapter.nodes.map((node, i) => ({
        node,
        x: PATH_WIDTH / 2 + OFFSETS[i % OFFSETS.length],
        y: i * ROW_HEIGHT + 48,
      }));
      const path = placed
        .map((point, i) => {
          if (i === 0) {
            return `M${point.x} ${point.y}`;
          }
          const prev = placed[i - 1];
          const midY = (prev.y + point.y) / 2;
          return `C${prev.x} ${midY} ${point.x} ${midY} ${point.x} ${point.y}`;
        })
        .join(' ');
      return { chapter, placed, path, height: chapter.nodes.length * ROW_HEIGHT };
    }),
  );

  constructor() {
    this.store.ensureLoaded();
    // The journey follows the active course; switching course elsewhere reloads it.
    effect(() => {
      const courseId = this.store.stats()?.courseId;
      if (courseId && courseId !== untracked(this.journey)?.courseId) {
        untracked(() => this.load(courseId));
      }
    });
  }

  protected load(courseId = this.store.stats()?.courseId ?? 'python'): void {
    this.error.set(false);
    this.api.getJourney(courseId).subscribe({
      next: (journey) => {
        this.journey.set(journey);
        // Bring the next activity into view once it is rendered.
        setTimeout(() =>
          this.host.nativeElement
            .querySelector('[data-current="true"]')
            ?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
        );
      },
      error: () => this.error.set(true),
    });
  }

  protected toggle(nodeId: string): void {
    this.selectedId.update((current) => (current === nodeId ? null : nodeId));
  }

  protected claimChest(node: JourneyNode): void {
    this.claiming.set(true);
    this.api
      .claimChest(node.id)
      .pipe(finalize(() => this.claiming.set(false)))
      .subscribe((reward) => {
        this.toast.success(`Chest opened: +${reward.gems} gems!`);
        this.store.addGems(reward.gems);
        this.selectedId.set(null);
        this.load(this.journey()?.courseId);
      });
  }

  protected onScroll(): void {
    const sections = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-chapter]');
    let visible: string | null = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= HEADER_LINE) {
        visible = section.dataset['chapter'] ?? null;
      }
    }
    this.visibleChapterId.set(visible);
  }

  protected saveGoal(activities: number | null): void {
    this.savingGoal.set(true);
    this.store
      .setDailyGoal(activities)
      .pipe(finalize(() => this.savingGoal.set(false)))
      .subscribe(() => {
        this.goalOpen.set(false);
        this.toast.success(
          activities === null ? 'Daily goal removed.' : `Daily goal set to ${activities} activities.`,
        );
      });
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.selectedId() && !target.closest('app-path-node, app-node-popover')) {
      this.selectedId.set(null);
    }
  }
}
