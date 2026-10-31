import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/** "Interview day" card: set a date and the daily plan paces itself to it. */
@Component({
  selector: 'app-interview-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './interview-day.html',
  styleUrl: './interview-day.scss',
})
export class InterviewDay {
  readonly date = input<string | null>(null);
  readonly changed = output<string | null>();

  protected readonly editing = signal(false);
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected daysLeft(date: string): number {
    return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000));
  }

  protected save(value: string): void {
    this.editing.set(false);
    this.changed.emit(value || null);
  }
}
