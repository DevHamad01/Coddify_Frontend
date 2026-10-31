import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import type * as Monaco from 'monaco-editor';

import { EDITOR_THEMES } from '../../data/editor-themes';

/** Where angular.json copies `node_modules/monaco-editor/min/vs`. */
const MONACO_BASE = 'assets/monaco/vs';

type AmdRequire = ((deps: string[], onLoad: () => void, onError: (e: unknown) => void) => void) & {
  config(options: { paths: Record<string, string> }): void;
};

/** Globals the AMD loader adds to `window` (Node typings claim `require` for something else). */
interface MonacoGlobals {
  require?: AmdRequire;
  monaco?: typeof Monaco;
}

/**
 * Loads Monaco once, on demand, through its AMD loader so the ~3 MB editor never lands in the
 * main bundle. Only call from the browser (e.g. inside `afterNextRender`).
 */
@Injectable({ providedIn: 'root' })
export class MonacoLoader {
  private readonly document = inject(DOCUMENT);
  private loading?: Promise<typeof Monaco>;

  load(): Promise<typeof Monaco> {
    this.loading ??= new Promise<typeof Monaco>((resolve, reject) => {
      const win = this.document.defaultView as unknown as MonacoGlobals;
      if (win.monaco) {
        resolve(win.monaco);
        return;
      }
      const script = this.document.createElement('script');
      script.src = `${MONACO_BASE}/loader.js`;
      script.onerror = () => reject(new Error('Could not load the code editor.'));
      script.onload = () => {
        const amdRequire = win.require!;
        amdRequire.config({ paths: { vs: MONACO_BASE } });
        amdRequire(
          ['vs/editor/editor.main'],
          () => {
            defineThemes(win.monaco!);
            resolve(win.monaco!);
          },
          reject,
        );
      };
      this.document.body.appendChild(script);
    });
    return this.loading;
  }
}

/** Unlockable dark palettes plus the light theme that matches the app tokens. */
function defineThemes(monaco: typeof Monaco): void {
  // One dark theme per unlockable palette; 'coddify-dark' stays as the default alias.
  for (const [name, palette] of Object.entries(EDITOR_THEMES)) {
    const hex = (color: string) => color.replace('#', '');
    const theme: Monaco.editor.IStandaloneThemeData = {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: hex(palette.foreground) },
        { token: 'comment', foreground: hex(palette.comment), fontStyle: 'italic' },
        { token: 'string', foreground: hex(palette.string) },
        { token: 'keyword', foreground: hex(palette.keyword) },
        { token: 'number', foreground: hex(palette.number) },
        { token: 'identifier.function', foreground: hex(palette.function) },
        { token: 'type', foreground: hex(palette.function) },
      ],
      colors: {
        'editor.background': palette.background,
        'editor.foreground': palette.foreground,
        'editor.lineHighlightBackground': palette.lineHighlight,
        'editorLineNumber.foreground': '#6E6E6E',
        'editorLineNumber.activeForeground': palette.foreground,
        'editorGutter.background': palette.background,
        'editor.selectionBackground': palette.cursor + '40',
        'editorCursor.foreground': palette.cursor,
      },
    };
    monaco.editor.defineTheme(name, theme);
    if (name === 'theme-coddify') {
      monaco.editor.defineTheme('coddify-dark', theme);
    }
  }
  monaco.editor.defineTheme('coddify-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.lineHighlightBackground': '#F3F5F8',
      'editorCursor.foreground': '#0D9488',
    },
  });
}
