import { RenderMode, ServerRoute } from '@angular/ssr';

import { BLOG_POSTS } from './features/blog/blog-posts';

/**
 * Only public marketing pages are prerendered. Everything else depends on the
 * signed-in user or query params (tokens), so it renders in the browser.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => BLOG_POSTS.map((post) => ({ slug: post.slug })),
  },
  { path: '**', renderMode: RenderMode.Client },
];
