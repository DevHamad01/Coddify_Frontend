import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeLine, TokenKind } from '../landing-content';

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
  template: `
    <pre
      class="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 sm:text-sm"
      [attr.aria-label]="label()"
    ><code>@for (line of lines(); track $index; let n = $index) {<span class="flex"><span class="mr-4 w-5 shrink-0 select-none text-right" style="color: var(--mock-muted)" aria-hidden="true">{{ n + 1 }}</span><span>@for (token of line; track $index) {<span [style.color]="colors[token.kind]">{{ token.text }}</span>}</span></span>}</code></pre>
  `,
})
export class CodeWindow {
  readonly lines = input.required<readonly CodeLine[]>();
  readonly label = input<string>('Code example');

  protected readonly colors = TOKEN_COLOR;
}
