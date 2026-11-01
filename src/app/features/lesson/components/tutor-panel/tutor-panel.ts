import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { finalize } from 'rxjs';

import { ProgressStore } from '../../../../core/gamification/progress.store';
import { RunResult } from '../../../../core/learning/learning.models';
import { TutorApi } from '../../../../core/learning/tutor-api';
import { tutorLook } from '../../../../shared/data/tutor-looks';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { TutorBot } from '../../../../shared/ui/tutor-bot/tutor-bot';
import { RichText } from '../../../../shared/ui/rich-text/rich-text';

interface ChatMessage {
  readonly id: number;
  readonly from: 'me' | 'bit';
  readonly text: string;
}

const SUGGESTION = 'Can you help me with this challenge?';

/** Side panel chat with Bit. The tutor sees the lesson, the current code and the last run. */
@Component({
  selector: 'app-tutor-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Mascot, RichText, TutorBot],
  templateUrl: './tutor-panel.html',
  styleUrl: './tutor-panel.scss',
})
export class TutorPanel {
  /** Set one of these: the lesson or the practice problem the learner is working on. */
  readonly lessonId = input<string>('');
  readonly problemId = input<string>('');
  readonly code = input.required<string>();
  readonly lastRun = input<RunResult | null>(null);
  readonly closed = output<void>();

  private readonly api = inject(TutorApi);
  /** The tutor character equipped in the store. */
  protected readonly look = inject(ProgressStore).tutorLook;
  protected readonly tutorName = computed(() => tutorLook(this.look()).name);
  private readonly thread = viewChild<ElementRef<HTMLElement>>('thread');
  private nextId = 0;

  protected readonly messages = signal<readonly ChatMessage[]>([]);
  protected readonly draft = signal(SUGGESTION);
  protected readonly thinking = signal(false);

  /** Sends a question; also called by the lesson's "Explain challenge" button. */
  ask(text: string): void {
    const question = text.trim();
    if (!question || this.thinking()) {
      return;
    }
    this.push('me', question);
    this.draft.set('');
    this.thinking.set(true);
    this.api
      .ask({
        lessonId: this.lessonId() || undefined,
        problemId: this.problemId() || undefined,
        message: question,
        code: this.code(),
        lastRun: this.lastRun(),
      })
      .pipe(finalize(() => this.thinking.set(false)))
      .subscribe({
        next: (reply) => this.push('bit', reply.text),
        error: () => this.push('bit', "I couldn't reach the tutor service. Try again in a moment."),
      });
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.ask(this.draft());
    }
  }

  private push(from: ChatMessage['from'], text: string): void {
    this.messages.update((list) => [...list, { id: this.nextId++, from, text }]);
    setTimeout(() => {
      const el = this.thread()?.nativeElement;
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }
}
