import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import type * as Monaco from 'monaco-editor';

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

/** Editor themes matching the app tokens (near-black dark, white light). */
function defineThemes(monaco: typeof Monaco): void {
  monaco.editor.defineTheme('coddify-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'number', foreground: 'B5CEA8' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.lineHighlightBackground': '#2A2A2A',
      'editorLineNumber.foreground': '#6E6E6E',
      'editorLineNumber.activeForeground': '#D4D4D4',
      'editorGutter.background': '#1E1E1E',
      'editor.selectionBackground': '#14B8A640',
      'editorCursor.foreground': '#14B8A6',
    },
  });
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
