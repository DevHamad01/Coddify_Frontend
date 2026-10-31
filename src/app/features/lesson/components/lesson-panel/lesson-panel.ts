import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { Lesson, Submission } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { IconName } from '../../../../shared/ui/icon/icons';
import { RichText } from '../../../../shared/ui/rich-text/rich-text';

type PanelTab = 'lesson' | 'reference' | 'submissions';

const TABS: readonly { id: PanelTab; label: string; icon: IconName }[] = [
  { id: 'lesson', label: 'Lesson', icon: 'file-text' },
  { id: 'reference', label: 'Reference', icon: 'search' },
  { id: 'submissions', label: 'Submissions', icon: 'history' },
];

/** Left side of the lesson: explanation, the challenge, reference cards and past submissions. */
@Component({
  selector: 'app-lesson-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Icon, RichText],
  templateUrl: './lesson-panel.html',
  styleUrl: './lesson-panel.scss',
})
export class LessonPanel {
  readonly lesson = input.required<Lesson>();
  readonly submissions = input<readonly Submission[]>([]);
  readonly explain = output<void>();
  readonly loadCode = output<string>();

  protected readonly tabs = TABS;
  protected readonly tab = signal<PanelTab>('lesson');
  /** TL;DR: one-line summary instead of the full explanation. */
  protected readonly tldr = signal(false);
  /** Hide: collapse the explanation and show only the challenge. */
  protected readonly hidden = signal(false);
}
