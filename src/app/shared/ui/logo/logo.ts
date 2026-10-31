import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Robot-head mark + "Coddify" wordmark. Links home unless `link` is false. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  readonly link = input<boolean>(true);
  readonly showWordmark = input<boolean>(true);
}
