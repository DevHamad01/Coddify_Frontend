import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { Button } from '../../shared/ui/button/button';
import { Mascot } from '../../shared/ui/mascot/mascot';

/**
 * Placeholder for screens planned in later sprints. Route `data.title` names the screen;
 * routes with a `:slug` param fall back to a title made from it ("cheat-sheets" → "Cheat sheets").
 */
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
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    combineLatest([this.route.data, this.route.paramMap]).pipe(
      map(([data, params]) => {
        const slug = params.get('slug');
        const fromSlug = slug
          ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
          : null;
        return (data['title'] as string | undefined) ?? fromSlug ?? 'This page';
      }),
    ),
    { initialValue: 'This page' },
  );
}
