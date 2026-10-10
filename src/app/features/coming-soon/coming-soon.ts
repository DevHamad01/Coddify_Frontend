import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { Button } from '../../shared/ui/button/button';
import { Mascot } from '../../shared/ui/mascot/mascot';

/** Placeholder for screens planned in later sprints. Route `data.title` names the screen. */
@Component({
  selector: 'app-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, Mascot],
  host: { class: 'flex flex-1 items-center justify-center px-4 py-20' },
  template: `
    <section class="flex max-w-md flex-col items-center text-center">
      <app-mascot pose="thinking" [size]="140" class="animate-float" />
      <p class="eyebrow mt-6">Coming soon</p>
      <h1 class="mt-2 text-3xl font-bold">{{ title() }}</h1>
      <p class="mt-3 text-muted">
        Owlbit is still wiring this part up. It lands in an upcoming sprint, so check back soon.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a appButton variant="secondary" routerLink="/">Back to home</a>
        @if (auth.isAuthenticated()) {
          <button appButton variant="ghost" type="button" (click)="auth.logout()">Log out</button>
        }
      </div>
    </section>
  `,
})
export class ComingSoon {
  protected readonly auth = inject(AuthService);
  protected readonly title = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => (data['title'] as string | undefined) ?? 'This page')),
    { initialValue: 'This page' },
  );
}
