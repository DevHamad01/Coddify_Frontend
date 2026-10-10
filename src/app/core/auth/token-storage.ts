import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { AuthSession } from './auth.models';

const KEY = 'coddify.session';

export interface StoredSession {
  readonly session: AuthSession;
  readonly remember: boolean;
}

/**
 * Persists the session in the browser only: localStorage for "remember me",
 * sessionStorage otherwise (cleared when the tab closes). No-ops during SSR.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  load(): StoredSession | null {
    if (!this.isBrowser) {
      return null;
    }
    for (const [store, remember] of [
      [localStorage, true],
      [sessionStorage, false],
    ] as const) {
      const session = read(store);
      if (session) {
        return { session, remember };
      }
    }
    return null;
  }

  save(session: AuthSession, remember: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    this.clear();
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session));
    } catch {
      // Storage blocked: the session still lives in memory for this page load.
    }
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      // Nothing to clear.
    }
  }
}

function read(store: Storage): AuthSession | null {
  try {
    const raw = store.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<AuthSession>;
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    !!candidate.user
  );
}
