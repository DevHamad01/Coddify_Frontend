import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeLine, TokenKind } from '../../landing-content';

/** Fixed syntax colours: the mock editor is always dark, whatever the page theme. */
const TOKEN_COLOR: Record<TokenKind, string> = {
  kw: '#C4B5FD',
  fn: '#5EEAD4',
  str: '#FCD34D',
  num: '#FDBA74',
  cm: '#64748B',
  op: '#93A1B8',
  pl: '#E8EEF8',
};

/** Line-numbered, syntax-coloured code block rendered from tokens (no highlighter dependency). */
@Component({
  selector: 'app-code-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './code-window.html',
  styleUrl: './code-window.scss',
})
export class CodeWindow {
  readonly lines = input.required<readonly CodeLine[]>();
  readonly label = input<string>('Code example');

  protected readonly colors = TOKEN_COLOR;
}
