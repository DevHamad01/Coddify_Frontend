import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { TechId } from '../../../../shared/data/tech';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { PillTabs } from '../../../../shared/ui/pill-tabs/pill-tabs';
import { FeatureSplit } from '../../components/feature-split/feature-split';
import { ROADMAPS } from '../../landing-content';

const COLUMNS = 3;

interface PathNode {
  readonly label: string;
  readonly icon: IconName;
  readonly tech?: TechId;
  readonly number: number | null;
  readonly row: number;
  readonly col: number;
  /** Where the dotted connector to the next node goes. */
  readonly link: 'right' | 'left' | 'down-right' | 'down-left' | null;
}

@Component({
  selector: 'app-roadmaps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, PillTabs, FeatureSplit, TechLogo],
  host: { id: 'roadmaps', class: 'block scroll-mt-16' },
  templateUrl: './roadmaps.html',
  styleUrl: './roadmaps.scss',
})
export class Roadmaps {
  protected readonly tabs = ROADMAPS.map(({ id, title }) => ({ id, label: title }));
  protected readonly selected = signal(ROADMAPS[0].id);
  protected readonly roadmap = computed(
    () => ROADMAPS.find((item) => item.id === this.selected()) ?? ROADMAPS[0],
  );

  /** Lays steps out as a snake (left→right, then right→left), ending in a certificate tile. */
  protected readonly nodes = computed<PathNode[]>(() => {
    const items: { label: string; icon: IconName; tech?: TechId; number: number | null }[] = [
      ...this.roadmap().steps.map((step, i) => ({ ...step, number: i + 1 })),
      { label: 'Certificate', icon: 'award', number: null },
    ];
    const place = (i: number) => {
      const row = Math.floor(i / COLUMNS);
      const offset = i % COLUMNS;
      return { row, col: row % 2 === 0 ? offset : COLUMNS - 1 - offset };
    };
    return items.map((item, i) => {
      const here = place(i);
      const next = i < items.length - 1 ? place(i + 1) : null;
      let link: PathNode['link'] = null;
      if (next && next.row === here.row) {
        link = next.col > here.col ? 'right' : 'left';
      } else if (next) {
        link = here.col === COLUMNS - 1 ? 'down-right' : 'down-left';
      }
      return { ...item, ...here, link };
    });
  });
}
