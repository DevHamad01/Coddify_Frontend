import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../../../shared/ui/icon/icon';
import { RESOURCE_GROUPS } from '../../nav-items';

/** Resources mega menu: groups on the left, a two-column list of tools for the active group. */
@Component({
  selector: 'app-resources-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './resources-menu.html',
  styleUrl: './resources-menu.scss',
})
export class ResourcesMenu {
  protected readonly groups = RESOURCE_GROUPS;
  protected readonly active = signal(RESOURCE_GROUPS[0].id);
  protected readonly links = computed(
    () => this.groups.find((group) => group.id === this.active())?.links ?? [],
  );
}
