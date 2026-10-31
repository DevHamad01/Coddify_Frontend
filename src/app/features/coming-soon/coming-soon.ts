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
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  protected readonly auth = inject(AuthService);
  protected readonly title = toSignal(
    inject(ActivatedRoute).data.pipe(
      map((data) => (data['title'] as string | undefined) ?? 'This page'),
    ),
    { initialValue: 'This page' },
  );
}
