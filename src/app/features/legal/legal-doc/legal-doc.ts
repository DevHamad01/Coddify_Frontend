import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RichText } from '../../../shared/ui/rich-text/rich-text';

/** One numbered section of a legal page. Paragraphs and bullets support **bold** and `code`. */
export interface LegalSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  /** A simple table: the first row is the header. */
  readonly table?: readonly (readonly string[])[];
  /** Paragraphs shown after the bullets or table. */
  readonly after?: readonly string[];
}

/**
 * Shared layout for Terms and Privacy: title, "last updated", a sticky contents list
 * on desktop and the numbered sections.
 */
@Component({
  selector: 'app-legal-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RichText],
  host: { class: 'block' },
  templateUrl: './legal-doc.html',
  styleUrl: './legal-doc.scss',
})
export class LegalDoc {
  readonly title = input.required<string>();
  readonly intro = input.required<readonly string[]>();
  readonly updated = input.required<string>();
  readonly sections = input.required<readonly LegalSection[]>();
}
