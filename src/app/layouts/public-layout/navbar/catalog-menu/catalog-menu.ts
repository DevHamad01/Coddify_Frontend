import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TechCategory, formatLearners, techsIn } from '../../../../shared/data/tech';
import { Icon } from '../../../../shared/ui/icon/icon';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { CATALOG_CATEGORIES, LEARNING_PATHS } from '../../nav-items';

/** Courses shown per category before the "see all" footer takes over. */
const MAX_COURSES = 8;

/**
 * Catalog mega menu: categories on the left (hover or arrow keys switch them),
 * course cards with Docs/Playground shortcuts on the right, learning paths under "Popular".
 */
@Component({
  selector: 'app-catalog-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, TechLogo],
  templateUrl: './catalog-menu.html',
  styleUrl: './catalog-menu.scss',
})
export class CatalogMenu {
  protected readonly categories = CATALOG_CATEGORIES;
  protected readonly paths = LEARNING_PATHS;
  protected readonly formatLearners = formatLearners;

  protected readonly active = signal<TechCategory>('popular');
  protected readonly activeCategory = computed(
    () => this.categories.find((category) => category.id === this.active()) ?? this.categories[0],
  );
  protected readonly courses = computed(() => techsIn(this.active()).slice(0, MAX_COURSES));

  protected onCategoryKey(event: KeyboardEvent, index: number): void {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) {
      return;
    }
    event.preventDefault();
    const next = (index + delta + this.categories.length) % this.categories.length;
    this.active.set(this.categories[next].id);
    const list = (event.currentTarget as HTMLElement).parentElement?.parentElement;
    list?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  }
}
