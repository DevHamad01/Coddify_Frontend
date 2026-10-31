import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';

import { ProgressStore } from '../../core/gamification/progress.store';
import { LearningApi } from '../../core/learning/learning-api';
import { Journey as JourneyData, JourneyNode } from '../../core/learning/learning.models';
import { LevelCard } from '../../layouts/app-layout/rail/level-card/level-card';
import { LeaderboardWidget } from '../../layouts/app-layout/rail/leaderboard-widget/leaderboard-widget';
import { MissionsWidget } from '../../layouts/app-layout/rail/missions-widget/missions-widget';
import { PromoCard } from '../../layouts/app-layout/rail/promo-card/promo-card';
import { PageShell } from '../../layouts/app-layout/page-shell/page-shell';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { NodePopover } from './components/node-popover/node-popover';
import { PathNode } from './components/path-node/path-node';
import { SyllabusHeader } from './components/syllabus-header/syllabus-header';

/** Horizontal offsets (px from the centre line) that make the path zig-zag. */
const OFFSETS = [0, 62, 0, -62];
const ROW_HEIGHT = 128;
const PATH_WIDTH = 320;

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
    PromoCard,
    LeaderboardWidget,
    MissionsWidget,
  ],
  host: {
    '(document:keydown.escape)': 'selectedId.set(null)',
    '(document:click)': 'onDocumentClick($event)',
  },
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class Journey {
  private readonly api = inject(LearningApi);
  private readonly store = inject(ProgressStore);
  private readonly toast = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly pathWidth = PATH_WIDTH;
  protected readonly journey = signal<JourneyData | null>(null);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly claiming = signal(false);
  protected readonly error = signal(false);

  protected readonly currentChapter = computed(() => {
    const chapters = this.journey()?.chapters ?? [];
    return (
      chapters.find((chapter) => chapter.nodes.some((node) => node.state === 'current')) ??
      chapters[chapters.length - 1]
    );
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
    this.load();
  }

  protected load(): void {
    this.error.set(false);
    this.api.getJourney('python').subscribe({
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
        this.load();
      });
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.selectedId() && !target.closest('app-path-node, app-node-popover')) {
      this.selectedId.set(null);
    }
  }
}
