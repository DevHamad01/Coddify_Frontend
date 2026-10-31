import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';

import { LessonReward } from '../../../../core/learning/learning.models';
import { Button } from '../../../../shared/ui/button/button';
import { Icon } from '../../../../shared/ui/icon/icon';
import { NavArt } from '../../../../shared/ui/nav-art/nav-art';

/** Reward card shown over the editor when every test passes. */
@Component({
  selector: 'app-lesson-complete-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, NavArt],
  host: { '(document:keydown.escape)': 'continued.emit()' },
  templateUrl: './lesson-complete-modal.html',
  styleUrl: './lesson-complete-modal.scss',
})
export class LessonCompleteModal {
  readonly reward = input.required<LessonReward>();
  readonly lessonTitle = input.required<string>();
  readonly chapterTitle = input.required<string>();
  readonly continued = output<void>();

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => host.nativeElement.querySelector<HTMLButtonElement>('button')?.focus());
  }
}
