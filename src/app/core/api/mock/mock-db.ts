import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, defer, map, timer } from 'rxjs';

import { User } from '../../auth/auth.models';

export interface MockUserRecord extends User {
  /** Plain text is acceptable here: this store only exists in the browser for demos. */
  password: string;
  verificationToken?: string;
  resetToken?: string;
}

interface MockState {
  users: MockUserRecord[];
  /** refresh token → user email */
  refreshTokens: Record<string, string>;
}

const STORAGE_KEY = 'coddify.mock-db';
export const MOCK_PASSWORD = 'Coddify123';

/**
 * Seed accounts (all use the password `Coddify123`):
 * - demo@coddify.dev: verified, onboarding done → lands on /app
 * - new@coddify.dev: verified, onboarding pending → lands on /onboarding
 * - unverified@coddify.dev: login fails with "Email not verified"
 */
const SEED: MockUserRecord[] = [
  seedUser('u-demo', 'Ali Raza', 'demo@coddify.dev', true, true),
  seedUser('u-new', 'Sana Tariq', 'new@coddify.dev', true, false),
  seedUser('u-unverified', 'Usman Ahmed', 'unverified@coddify.dev', false, false, 'verify-unverified'),
];

/**
 * In-memory "database" shared by the mock APIs, mirrored to localStorage (browser only)
 * so accounts created during a demo survive a page refresh.
 */
@Injectable({ providedIn: 'root' })
export class MockDb {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private state: MockState = this.load();

  findUser(email: string): MockUserRecord | undefined {
    return this.state.users.find((user) => user.email === email.trim().toLowerCase());
  }

  findUserById(id: string): MockUserRecord | undefined {
    return this.state.users.find((user) => user.id === id);
  }

  addUser(user: MockUserRecord): void {
    this.state.users.push(user);
    this.save();
  }

  updateUser(email: string, changes: Partial<MockUserRecord>): MockUserRecord | undefined {
    const user = this.findUser(email);
    if (user) {
      Object.assign(user, changes);
      this.save();
    }
    return user;
  }

  storeRefreshToken(token: string, email: string): void {
    this.state.refreshTokens[token] = email;
    this.save();
  }

  consumeRefreshToken(token: string): string | undefined {
    const email = this.state.refreshTokens[token];
    delete this.state.refreshTokens[token];
    this.save();
    return email;
  }

  /** Wraps a synchronous mock handler with realistic 400–800ms latency. Throwing → error notification. */
  respond<T>(handler: () => T): Observable<T> {
    return defer(() => timer(400 + Math.round(Math.random() * 400)).pipe(map(() => handler())));
  }

  private load(): MockState {
    const fresh: MockState = { users: SEED.map((user) => ({ ...user })), refreshTokens: {} };
    if (!this.isBrowser) {
      return fresh;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MockState) : fresh;
    } catch {
      return fresh;
    }
  }

  private save(): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage full or blocked: keep working in memory.
    }
  }
}

export function randomToken(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function seedUser(
  id: string,
  fullName: string,
  email: string,
  emailVerified: boolean,
  onboardingCompleted: boolean,
  verificationToken?: string,
): MockUserRecord {
  return { id, fullName, email, emailVerified, onboardingCompleted, password: MOCK_PASSWORD, verificationToken };
}
