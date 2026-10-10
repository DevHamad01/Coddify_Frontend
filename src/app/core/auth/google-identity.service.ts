import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { ApiError } from '../api/api-error';
import { APP_ENV } from '../config/environment';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/** Minimal typings for the parts of Google Identity Services we use. */
interface CredentialResponse {
  readonly credential: string;
}

interface PromptMomentNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
  }): void;
  prompt(listener?: (notification: PromptMomentNotification) => void): void;
}

interface GoogleWindow extends Window {
  google?: { accounts: { id: GoogleAccountsId } };
}

/**
 * Lazily loads the Google Identity Services script (browser only) and returns an ID token.
 * The token is sent to our backend (`/google-login`), which verifies it with Google.
 */
@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly clientId = inject(APP_ENV).googleClientId;
  private scriptLoad?: Promise<GoogleAccountsId>;

  get isConfigured(): boolean {
    return this.clientId.length > 0;
  }

  async requestIdToken(): Promise<string> {
    if (!this.isConfigured) {
      throw new ApiError('google_not_configured', 'Google sign-in not configured');
    }
    if (!this.isBrowser) {
      throw new ApiError('unknown', 'Google sign-in is only available in the browser.');
    }
    const accounts = await this.loadScript();
    return new Promise<string>((resolve, reject) => {
      accounts.initialize({
        client_id: this.clientId,
        callback: (response) => resolve(response.credential),
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });
      accounts.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new ApiError('google_cancelled', 'Google sign-in was closed before finishing.'));
        }
      });
    });
  }

  private loadScript(): Promise<GoogleAccountsId> {
    const win = this.document.defaultView as GoogleWindow | null;
    if (win?.google) {
      return Promise.resolve(win.google.accounts.id);
    }
    this.scriptLoad ??= new Promise<GoogleAccountsId>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () =>
        win?.google
          ? resolve(win.google.accounts.id)
          : reject(new ApiError('unknown', 'Google sign-in failed to load.'));
      script.onerror = () => {
        this.scriptLoad = undefined;
        reject(new ApiError('network', 'Could not load Google sign-in. Check your connection.'));
      };
      this.document.head.appendChild(script);
    });
    return this.scriptLoad;
  }
}
