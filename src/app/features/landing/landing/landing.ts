import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { AiTutor } from '../sections/ai-tutor';
import { Certificates } from '../sections/certificates';
import { Faq } from '../sections/faq';
import { FinalCta } from '../sections/final-cta';
import { Hero } from '../sections/hero';
import { LearnByDoing } from '../sections/learn-by-doing';
import { League } from '../sections/league';
import { Roadmaps } from '../sections/roadmaps';
import { Streak } from '../sections/streak';

const TITLE = 'Coddify | Learn to code, one small win a day';
const DESCRIPTION =
  'Learn Python, JavaScript, C++, Java and C# with bite-sized interactive lessons, daily streaks, ' +
  'weekly leagues and an AI tutor that gives hints instead of answers. Free to start, no setup.';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Roadmaps, Certificates, LearnByDoing, Streak, AiTutor, League, Faq, FinalCta],
  templateUrl: './landing.html',
})
export class Landing {
  constructor() {
    inject(Title).setTitle(TITLE);
    const meta = inject(Meta);
    meta.updateTag({ name: 'description', content: DESCRIPTION });
    meta.updateTag({ property: 'og:type', content: 'website' });
    meta.updateTag({ property: 'og:site_name', content: 'Coddify' });
    meta.updateTag({ property: 'og:title', content: TITLE });
    meta.updateTag({ property: 'og:description', content: DESCRIPTION });
    meta.updateTag({ name: 'twitter:card', content: 'summary' });
    meta.updateTag({ name: 'twitter:title', content: TITLE });
    meta.updateTag({ name: 'twitter:description', content: DESCRIPTION });
  }
}
