import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';
import { PillTab, PillTabs } from '../../../../shared/ui/pill-tabs/pill-tabs';
import { CodeWindow } from '../../components/code-window/code-window';
import { FeatureSplit } from '../../components/feature-split/feature-split';
import { CodeLine, TestCase, TokenKind } from '../../landing-content';

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
  templateUrl: './learn-by-doing.html',
  styleUrl: './learn-by-doing.scss',
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
