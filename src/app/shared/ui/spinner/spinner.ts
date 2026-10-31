import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', role: 'status' },
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  readonly size = input<number>(20);
  readonly label = input<string>('Loading');
}
