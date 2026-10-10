import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../shared/ui/chip/chip';
import { Icon } from '../../../shared/ui/icon/icon';
import { Mascot } from '../../../shared/ui/mascot/mascot';
import { FeatureSplit } from '../components/feature-split';

interface ChatMessage {
  readonly from: 'student' | 'tutor';
  readonly text: string;
}

const CHAT: readonly ChatMessage[] = [
  { from: 'student', text: 'My loop prints 1 to 9 but the task says 1 to 10. Can you just fix it for me?' },
  {
    from: 'tutor',
    text: "I won't paste the answer, but here's a nudge: when range() gets an end number, does it include that number or stop just before it?",
  },
  { from: 'student', text: 'Ohh, it stops before it. So I need range(1, 11)?' },
  { from: 'tutor', text: 'Exactly! Run the tests and watch them turn green.' },
];

@Component({
  selector: 'app-ai-tutor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Icon, Mascot, FeatureSplit],
  host: { id: 'ai-tutor', class: 'block scroll-mt-16' },
  template: `
    <app-feature-split
      eyebrow="AI tutor"
      heading="A tutor that hints but never gives the answer"
      lead="Owlbit reads your code and your last error, then asks the right question to get you unstuck. You still do the thinking, which is how it actually sticks."
    >
      <ul copy class="flex flex-col gap-3 text-[15px] text-muted">
        @for (point of points; track point) {
          <li class="flex items-center gap-2.5"><app-icon name="sparkles" [size]="18" class="text-ai" />{{ point }}</li>
        }
      </ul>

      <div visual class="mock-window w-full max-w-md">
        <div class="mock-header">
          <span class="flex items-center gap-2.5">
            <app-mascot pose="thinking" [size]="34" label="" />
            <span>
              <span class="block text-sm font-bold">Owlbit</span>
              <span class="block text-xs" style="color: var(--mock-muted)">Your AI tutor</span>
            </span>
          </span>
          <app-chip tone="ai" icon="lightbulb">Hint 1 of 3</app-chip>
        </div>
        <ol class="flex flex-col gap-3 p-4 text-sm leading-6" aria-label="Example conversation with the AI tutor">
          @for (message of chat; track $index) {
            <li
              class="max-w-[85%] rounded-2xl px-4 py-2.5"
              [class]="
                message.from === 'student'
                  ? 'self-end rounded-br-md bg-primary text-primary-contrast'
                  : 'self-start rounded-bl-md border border-ai/30 bg-ai/15'
              "
            >
              <span class="sr-only">{{ message.from === 'student' ? 'Student:' : 'Owlbit:' }}</span>
              {{ message.text }}
            </li>
          }
        </ol>
        <div class="flex items-center gap-2 border-t px-4 py-3" style="border-color: var(--mock-border)">
          <span class="flex-1 rounded-xl px-3 py-2 text-sm" style="background: var(--mock-chip); color: var(--mock-muted)">
            Ask for a hint...
          </span>
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-ai text-white"><app-icon name="send" [size]="16" /></span>
        </div>
      </div>
    </app-feature-split>
  `,
})
export class AiTutor {
  protected readonly chat = CHAT;
  protected readonly points = [
    'Explains errors in plain English (or Roman Urdu, if you ask)',
    'Three levels of hints before it ever shows a solution path',
    'Available inside every exercise, any time of day',
  ];
}
