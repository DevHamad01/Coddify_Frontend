import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  /** Base URL of the .NET API, without a trailing slash. */
  readonly apiBaseUrl: string;
  /** true: in-browser mock API (no backend needed). false: real HTTP calls to `apiBaseUrl`. */
  readonly useMockApi: boolean;
  /** Google Identity Services OAuth client id. Empty disables Google sign-in. */
  readonly googleClientId: string;
}

/**
 * Single place to switch between the mock layer and the real backend.
 * Flip `useMockApi` to false once the .NET API is running.
 */
export const environment: AppEnvironment = {
  apiBaseUrl: 'https://localhost:7001',
  useMockApi: true,
  googleClientId: '',
};

/** Inject this instead of importing `environment`, so tests can override values. */
export const APP_ENV = new InjectionToken<AppEnvironment>('APP_ENV', {
  providedIn: 'root',
  factory: () => environment,
});
