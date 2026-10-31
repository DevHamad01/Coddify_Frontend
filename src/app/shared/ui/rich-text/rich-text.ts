import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface RichSegment {
  readonly kind: 'text' | 'bold' | 'code' | 'italic';
  readonly text: string;
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;

/** Splits lesson copy into plain, **bold**, `code` and *italic* runs. Exported for tests. */
export function parseRichText(text: string): RichSegment[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map<RichSegment>((part) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { kind: 'bold', text: part.slice(2, -2) };
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return { kind: 'code', text: part.slice(1, -1) };
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return { kind: 'italic', text: part.slice(1, -1) };
      }
      return { kind: 'text', text: part };
    });
}

/**
 * Renders a tiny markdown subset (**bold**, `code`, *italic*) through bindings, never innerHTML,
 * so lesson and tutor text from the API can't inject markup.
 */
@Component({
  selector: 'app-rich-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich-text.html',
  styleUrl: './rich-text.scss',
})
export class RichText {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseRichText(this.text()));
}
