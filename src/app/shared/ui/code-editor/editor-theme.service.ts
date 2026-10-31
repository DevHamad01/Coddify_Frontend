import { Injectable, signal } from '@angular/core';

import { DEFAULT_EDITOR_THEME, EDITOR_THEMES } from '../../data/editor-themes';

/** The unlocked editor theme the learner equipped; every code editor follows it in dark mode. */
@Injectable({ providedIn: 'root' })
export class EditorThemeService {
  private readonly current = signal(DEFAULT_EDITOR_THEME);
  readonly active = this.current.asReadonly();

  use(themeId: string): void {
    this.current.set(themeId in EDITOR_THEMES ? themeId : DEFAULT_EDITOR_THEME);
  }
}
