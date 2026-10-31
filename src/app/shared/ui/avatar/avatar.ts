import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PALETTE = ['#0EA5E9', '#14B8A6', '#8B5CF6', '#F97316', '#EC4899', '#22C55E', '#EAB308'];

/** Round avatar: photo when given, otherwise initials on a colour picked from the name. */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.background]': 'url() ? null : color()',
    '[style.font-size.px]': 'size() * 0.38',
  },
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  readonly name = input.required<string>();
  readonly url = input<string | null>(null);
  readonly size = input<number>(40);
  /** Small green dot, e.g. "active this week" on the leaderboard. */
  readonly online = input<boolean>(false);

  protected readonly initials = computed(() =>
    this.name()
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join(''),
  );

  protected readonly color = computed(() => {
    const hash = [...this.name()].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
    return PALETTE[hash % PALETTE.length];
  });
}
