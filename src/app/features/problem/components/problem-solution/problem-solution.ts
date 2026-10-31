import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

import { ProblemSolution as Solution, WorkspaceLanguage } from '../../../../core/practice/practice.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { RichText } from '../../../../shared/ui/rich-text/rich-text';

const LANGUAGE_LABEL: Record<WorkspaceLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++',
};

/** The walkthrough: approaches table, intuition, algorithm, code per language, pitfalls and FAQ. */
@Component({
  selector: 'app-problem-solution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RichText],
  templateUrl: './problem-solution.html',
  styleUrl: './problem-solution.scss',
})
export class ProblemSolution {
  readonly solution = input.required<Solution>();
  /** Editor language, preselected in the code tabs. */
  readonly language = input<WorkspaceLanguage>('python');

  protected readonly labels = LANGUAGE_LABEL;
  protected readonly codeLanguages = computed(
    () => Object.keys(this.solution().code) as WorkspaceLanguage[],
  );
  protected readonly codeTab = linkedSignal<WorkspaceLanguage | undefined>(() =>
    this.codeLanguages().includes(this.language()) ? this.language() : this.codeLanguages()[0],
  );
}
