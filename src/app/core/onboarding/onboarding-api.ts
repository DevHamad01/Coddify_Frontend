import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApiError } from '../api/api-error';
import { MockDb } from '../api/mock/mock-db';
import { AuthService } from '../auth/auth.service';
import { APP_ENV } from '../config/environment';
import { SaveOnboardingRequest, SaveOnboardingResponse } from './onboarding.models';

/** Onboarding backend contract; bound to the mock or HTTP version in `provideApis()`. */
export abstract class OnboardingApi {
  abstract save(request: SaveOnboardingRequest): Observable<SaveOnboardingResponse>;
}

@Injectable({ providedIn: 'root' })
export class HttpOnboardingApi extends OnboardingApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;

  save(request: SaveOnboardingRequest): Observable<SaveOnboardingResponse> {
    return this.http.post<SaveOnboardingResponse>(
      `${this.baseUrl}${API_ENDPOINTS.onboarding.save}`,
      request,
    );
  }
}

@Injectable({ providedIn: 'root' })
export class MockOnboardingApi extends OnboardingApi {
  private readonly db = inject(MockDb);
  private readonly auth = inject(AuthService);

  save(request: SaveOnboardingRequest): Observable<SaveOnboardingResponse> {
    // Read the user up front, like the real API reading the Bearer token.
    const email = this.auth.user()?.email;
    return this.db.respond(() => {
      if (!email) {
        throw new ApiError('unauthorized', 'Your session has expired. Please log in again.', 401);
      }
      this.db.updateUser(email, { onboardingCompleted: true, onboarding: request });
      return { onboardingCompleted: true };
    });
  }
}
