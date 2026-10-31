import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { ProblemRunResult, ProblemTest } from '../../../../core/practice/practice.models';
import { Icon } from '../../../../shared/ui/icon/icon';

/** Test list on the left; argument, output and expected output of the selected test. */
@Component({
  selector: 'app-test-cases',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './test-cases.html',
  styleUrl: './test-cases.scss',
})
export class TestCases {
  readonly tests = input.required<readonly ProblemTest[]>();
  readonly result = input<ProblemRunResult | null>(null);
  readonly running = input<boolean>(false);

  protected readonly selected = signal(0);
  protected readonly showExpected = signal(true);

  protected readonly current = computed(() => this.tests()[this.selected()]);
  protected readonly currentResult = computed(() =>
    this.result()?.results.find((result) => result.testId === this.current()?.id),
  );

  protected passedOf(testId: string): boolean | null {
    const result = this.result()?.results.find((item) => item.testId === testId);
    return result ? result.passed : null;
  }
}
