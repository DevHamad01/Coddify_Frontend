import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Icon } from '../../../shared/ui/icon/icon';
import { PillTab, PillTabs } from '../../../shared/ui/pill-tabs/pill-tabs';
import { CodeWindow } from '../components/code-window';
import { FeatureSplit } from '../components/feature-split';
import { CodeLine, TestCase, TokenKind } from '../landing-content';

const t = (text: string, kind: TokenKind = 'pl') => ({ text, kind });

const LOOP_CODE: readonly CodeLine[] = [
  [t('total', 'pl'), t(' = ', 'op'), t('0', 'num')],
  [
    t('for ', 'kw'),
    t('n '),
    t('in ', 'kw'),
    t('range', 'fn'),
    t('('),
    t('1', 'num'),
    t(', '),
    t('10', 'num'),
    t('):'),
  ],
  [t('    total'), t(' += ', 'op'), t('n')],
  [t('print', 'fn'), t('(total)')],
];

const TESTS: readonly (TestCase & { input: string; expected: string; actual: string })[] = [
  { label: 'Test 1', passed: true, input: 'range(1, 4)', expected: '6', actual: '6' },
  { label: 'Test 2', passed: true, input: 'range(1, 6)', expected: '15', actual: '15' },
  { label: 'Test 3', passed: false, input: 'range(1, 11)', expected: '55', actual: '45' },
];

@Component({
  selector: 'app-learn-by-doing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PillTabs, CodeWindow, FeatureSplit],
  host: { id: 'learn', class: 'block scroll-mt-16' },
  template: `
    <app-feature-split
      eyebrow="Learn by doing"
      heading="Write real code from lesson one"
      lead="No passive videos. Every lesson ends with you typing code, running it against tests and fixing it until it is green."
    >
      <app-pill-tabs
        copy
        class="mt-2"
        idPrefix="doing"
        label="How lessons work"
        [tabs]="tabs"
        [(selected)]="selected"
      />

      <div
        visual
        id="doing-panel"
        role="tabpanel"
        [attr.aria-labelledby]="'doing-tab-' + selected()"
        class="mock-window w-full max-w-lg"
      >
        <div class="mock-header">
          <span class="mock-chip"
            ><span class="h-2 w-2 rounded-full bg-info"></span>sum_numbers.py</span
          >
          <span class="mock-chip bg-primary text-primary-contrast"
            ><app-icon name="play" [size]="14" [filled]="true" />Run</span
          >
        </div>

        @switch (selected()) {
          @case ('write') {
            <app-code-window
              [lines]="code"
              label="Python loop that sums numbers"
              class="animate-fade-up"
            />
            <p
              class="border-t px-4 py-3 text-xs"
              style="border-color: var(--mock-border); color: var(--mock-muted)"
            >
              Task: add up every number from 1 to 10 and print the total.
            </p>
          }
          @case ('run') {
            <div class="grid animate-fade-up grid-cols-[120px_1fr] text-sm">
              <ul class="border-r py-2" style="border-color: var(--mock-border)">
                @for (test of tests; track test.label; let i = $index) {
                  <li
                    class="flex items-center justify-between px-4 py-2.5"
                    [style.background]="i === 2 ? 'var(--mock-chip)' : null"
                  >
                    {{ test.label }}
                    <app-icon
                      [name]="test.passed ? 'check-circle' : 'x-circle'"
                      [size]="16"
                      [class]="test.passed ? 'text-success' : 'text-danger'"
                    />
                  </li>
                }
              </ul>
              <dl class="flex flex-col gap-1 p-4 font-mono text-[13px]">
                <dt
                  class="text-[11px] font-bold uppercase tracking-wider"
                  style="color: var(--mock-muted)"
                >
                  Input
                </dt>
                <dd class="mb-2">{{ tests[2].input }}</dd>
                <dt
                  class="text-[11px] font-bold uppercase tracking-wider"
                  style="color: var(--mock-muted)"
                >
                  Expected
                </dt>
                <dd class="mb-2 text-success">{{ tests[2].expected }}</dd>
                <dt
                  class="text-[11px] font-bold uppercase tracking-wider"
                  style="color: var(--mock-muted)"
                >
                  Your output
                </dt>
                <dd class="text-danger">{{ tests[2].actual }}</dd>
              </dl>
            </div>
          }
          @case ('hint') {
            <div class="animate-fade-up">
              <app-code-window [lines]="code" label="Python loop that sums numbers" />
              <div class="m-4 mt-0 flex gap-3 rounded-2xl border border-ai/40 bg-ai/10 p-4 text-sm">
                <app-icon name="lightbulb" class="text-ai" />
                <p>
                  <span class="font-semibold text-ai">Hint 1 of 3:</span>
                  your total is 45, so the loop stops one number early. Check whether the end value
                  of
                  <code class="rounded bg-black/30 px-1">range()</code> is included.
                </p>
              </div>
            </div>
          }
        }
      </div>
    </app-feature-split>
  `,
})
export class LearnByDoing {
  protected readonly tabs: readonly PillTab[] = [
    { id: 'write', label: 'Write code', icon: 'code' },
    { id: 'run', label: 'Run tests', icon: 'play' },
    { id: 'hint', label: 'Get hints', icon: 'lightbulb' },
  ];
  protected readonly selected = signal('write');
  protected readonly code = LOOP_CODE;
  protected readonly tests = TESTS;
}
