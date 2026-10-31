import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

/** Must match the key read by the inline script in index.html. */
export const THEME_STORAGE_KEY = 'coddify.theme';

const THEME_COLOR: Record<ResolvedTheme, string> = { dark: '#252525', light: '#F6F8FB' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly systemPrefersLight = signal(false);

  readonly preference = signal<ThemePreference>('system');
  readonly resolved = computed<ResolvedTheme>(() => {
    const pref = this.preference();
    if (pref === 'system') {
      return this.systemPrefersLight() ? 'light' : 'dark';
    }
    return pref;
  });

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.preference.set(readPreference());
    if (typeof window.matchMedia !== 'function') {
      this.apply();
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: light)');
    this.systemPrefersLight.set(media.matches);
    const onChange = (event: MediaQueryListEvent): void => {
      this.systemPrefersLight.set(event.matches);
      this.apply();
    };
    media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', onChange));
    this.apply();
  }

  setPreference(pref: ThemePreference): void {
    this.preference.set(pref);
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this session.
    }
    this.apply();
  }

  /** Cycles dark → light → system, used by the compact navbar toggle. */
  cycle(): void {
    const order: ThemePreference[] = ['dark', 'light', 'system'];
    const next = order[(order.indexOf(this.preference()) + 1) % order.length];
    this.setPreference(next);
  }

  private apply(): void {
    const theme = this.resolved();
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';
  } catch {
    return 'system';
  }
}
