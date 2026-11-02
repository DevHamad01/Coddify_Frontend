import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { BlogCover } from '../../blog-posts';

/** Illustrated cover for a blog post: a coloured panel with the post's icon and tech logo. */
@Component({
  selector: 'app-post-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, TechLogo],
  host: { class: 'block', '[style.--cover]': 'cover().color' },
  templateUrl: './post-cover.html',
  styleUrl: './post-cover.scss',
})
export class PostCover {
  readonly cover = input.required<BlogCover>();
  /** Icon size in px; larger on the featured post and article header. */
  readonly size = input<number>(56);
}
