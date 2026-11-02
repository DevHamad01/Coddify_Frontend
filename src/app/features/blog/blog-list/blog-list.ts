import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { FinalCta } from '../../landing/sections/final-cta/final-cta';
import { BLOG_CATEGORIES, BLOG_POSTS, BlogCategory, formatPostDate } from '../blog-posts';
import { PostCard } from '../components/post-card/post-card';
import { PostCover } from '../components/post-cover/post-cover';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Icon, FinalCta, PostCard, PostCover],
  host: { class: 'block' },
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  protected readonly categories = BLOG_CATEGORIES;
  /** Newest post is featured in the hero. */
  protected readonly featured = BLOG_POSTS[0];
  protected readonly featuredDate = formatPostDate(this.featured.date);

  protected readonly category = signal<BlogCategory | null>(null);
  protected readonly query = signal('');
  protected readonly page = signal(1);

  protected readonly filtered = computed(() => {
    const category = this.category();
    const query = this.query().trim().toLowerCase();
    return BLOG_POSTS.filter(
      (post) =>
        (!category || post.category === category) &&
        (!query || `${post.title} ${post.excerpt}`.toLowerCase().includes(query)),
    );
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );
  protected readonly pages = computed(() =>
    Array.from({ length: this.pageCount() }, (_, i) => i + 1),
  );
  protected readonly visible = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  protected selectCategory(category: BlogCategory | null): void {
    this.category.set(category);
    this.page.set(1);
  }

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected goTo(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.pageCount()));
  }
}
