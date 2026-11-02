import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPost, formatPostDate } from '../../blog-posts';
import { PostCover } from '../post-cover/post-cover';

@Component({
  selector: 'app-post-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PostCover],
  host: { class: 'block' },
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  readonly post = input.required<BlogPost>();
  protected readonly date = computed(() => formatPostDate(this.post().date));
}
