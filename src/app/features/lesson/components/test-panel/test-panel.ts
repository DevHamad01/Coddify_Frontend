import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { RunResult, TestCase } from '../../../../core/learning/learning.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { Spinner } from '../../../../shared/ui/spinner/spinner';

/** Bottom panel under the editor: program output next to what the tests expect, or the solution. */
@Component({
  selector: 'app-test-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Spinner],
  templateUrl: './test-panel.html',
  styleUrl: './test-panel.scss',
})
export class TestPanel {
  readonly tests = input.required<readonly TestCase[]>();
  readonly result = input<RunResult | null>(null);
  readonly running = input<boolean>(false);
  readonly solution = input.required<string>();
  /** Solution stays hidden until the learner has tried at least once. */
  readonly attempts = input<number>(0);
  readonly useSolution = output<string>();

  protected readonly tab = signal<'tests' | 'solution'>('tests');
  protected readonly showExpected = signal(true);

  protected readonly allPassed = computed(() => this.result()?.passed ?? false);
  protected readonly passedIds = computed(
    () =>
      new Set(
        this.result()
          ?.tests.filter((test) => test.passed)
          .map((test) => test.testId),
      ),
  );
}
