import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { Mascot } from '../../../shared/ui/mascot/mascot';
import { RichText } from '../../../shared/ui/rich-text/rich-text';
import { FinalCta } from '../../landing/sections/final-cta/final-cta';
import { BLOG_POSTS, BlogBlock, findPost, formatPostDate } from '../blog-posts';
import { PostCard } from '../components/post-card/post-card';
import { PostCover } from '../components/post-cover/post-cover';

/** One article at /blog/:slug, with a table of contents and related posts. */
@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, Mascot, RichText, FinalCta, PostCard, PostCover],
  host: { class: 'block' },
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
})
export class BlogPost {
  readonly slug = input.required<string>();

  protected readonly post = computed(() => findPost(this.slug()) ?? null);
  protected readonly date = computed(() => {
    const post = this.post();
    return post ? formatPostDate(post.date) : '';
  });
  protected readonly headings = computed(() =>
    (this.post()?.body ?? []).filter(
      (block): block is Extract<BlogBlock, { kind: 'h2' }> => block.kind === 'h2',
    ),
  );
  /** Same category first, then the newest others. */
  protected readonly related = computed(() => {
    const post = this.post();
    if (!post) {
      return [];
    }
    const others = BLOG_POSTS.filter((other) => other.slug !== post.slug);
    return [
      ...others.filter((other) => other.category === post.category),
      ...others.filter((other) => other.category !== post.category),
    ].slice(0, 3);
  });

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.post()?.title ?? 'Article not found'} | Coddify Blog`));
  }
}
