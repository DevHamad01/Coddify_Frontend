import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { tutorLook } from '../../data/tutor-looks';

/**
 * One of the AI tutor robots, drawn in SVG from its look (colours, hat, glasses, headphones).
 * `animated` adds a gentle bob and blink so it feels alive in the tutor panel and store.
 */
@Component({
  selector: 'app-tutor-bot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-animated]': 'animated()',
    '[style.width.px]': 'size()',
    role: 'img',
    '[attr.aria-label]': 'label()',
  },
  templateUrl: './tutor-bot.html',
  styleUrl: './tutor-bot.scss',
})
export class TutorBot {
  /** Tutor look key, e.g. "ada". */
  readonly look = input.required<string>();
  readonly size = input<number>(64);
  readonly animated = input<boolean>(false);
  readonly label = input<string>('AI tutor');

  protected readonly style = computed(() => tutorLook(this.look()));
}
