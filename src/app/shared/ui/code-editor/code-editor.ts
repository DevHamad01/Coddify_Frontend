import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type * as Monaco from 'monaco-editor';

import { ThemeService } from '../../../core/theme/theme.service';
import { Spinner } from '../spinner/spinner';
import { MonacoLoader } from './monaco-loader.service';

/**
 * Monaco code editor bound to a signal model: `<app-code-editor [(value)]="code" language="python" />`.
 * Follows the app theme, resizes with its container and emits `run` on Ctrl/Cmd+Enter.
 */
@Component({
  selector: 'app-code-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Spinner],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
})
export class CodeEditor {
  readonly value = model<string>('');
  readonly language = input<string>('python');
  readonly readOnly = input<boolean>(false);
  readonly fontSize = input<number>(15);
  readonly ariaLabel = input<string>('Code editor');
  /** Ctrl/Cmd + Enter. */
  readonly run = output<void>();

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private readonly loader = inject(MonacoLoader);
  private readonly theme = inject(ThemeService);
  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private monaco?: typeof Monaco;

  protected readonly ready = signal(false);
  protected readonly failed = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      afterNextRender(() => this.init(destroyRef));
    }

    // Outside changes (reset, show solution) flow into the editor without moving the cursor needlessly.
    effect(() => {
      const value = this.value();
      if (this.ready() && this.editor && this.editor.getValue() !== value) {
        this.editor.setValue(value);
      }
    });
    effect(() => {
      const dark = this.theme.resolved() === 'dark';
      if (this.ready()) {
        this.monaco?.editor.setTheme(dark ? 'coddify-dark' : 'coddify-light');
      }
    });
    // Each effect reads its signals before checking `ready()` so it re-runs once Monaco has loaded.
    effect(() => {
      const language = this.language();
      const model = this.ready() ? this.editor?.getModel() : null;
      if (model && this.monaco) {
        this.monaco.editor.setModelLanguage(model, language);
      }
    });
    effect(() => {
      const options = { readOnly: this.readOnly(), fontSize: this.fontSize() };
      if (this.ready()) {
        this.editor?.updateOptions(options);
      }
    });
  }

  /** Puts the caret back in the editor (after closing a dialog, for example). */
  focus(): void {
    this.editor?.focus();
  }

  private async init(destroyRef: DestroyRef): Promise<void> {
    try {
      const monaco = await this.loader.load();
      this.monaco = monaco;
      const editor = monaco.editor.create(this.container().nativeElement, {
        value: this.value(),
        language: this.language(),
        theme: this.theme.resolved() === 'dark' ? 'coddify-dark' : 'coddify-light',
        readOnly: this.readOnly(),
        fontSize: this.fontSize(),
        fontFamily: '"JetBrains Mono", Consolas, monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 3,
        renderLineHighlight: 'all',
        smoothScrolling: true,
        tabSize: 4,
        ariaLabel: this.ariaLabel(),
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      });
      editor.onDidChangeModelContent(() => this.value.set(editor.getValue()));
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => this.run.emit());
      this.editor = editor;
      this.ready.set(true);
      destroyRef.onDestroy(() => editor.dispose());
    } catch {
      this.failed.set(true);
    }
  }
}
