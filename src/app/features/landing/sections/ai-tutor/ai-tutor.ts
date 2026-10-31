import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Chip } from '../../../../shared/ui/chip/chip';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Mascot } from '../../../../shared/ui/mascot/mascot';
import { FeatureSplit } from '../../components/feature-split/feature-split';

interface ChatMessage {
  readonly from: 'student' | 'tutor';
  readonly text: string;
}

const CHAT: readonly ChatMessage[] = [
  {
    from: 'student',
    text: 'My loop prints 1 to 9 but the task says 1 to 10. Can you just fix it for me?',
  },
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
  templateUrl: './ai-tutor.html',
  styleUrl: './ai-tutor.scss',
})
export class AiTutor {
  protected readonly chat = CHAT;
  protected readonly points = [
    'Explains errors in plain English (or Roman Urdu, if you ask)',
    'Three levels of hints before it ever shows a solution path',
    'Available inside every exercise, any time of day',
  ];
}
