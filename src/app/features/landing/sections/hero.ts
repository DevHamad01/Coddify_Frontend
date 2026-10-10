import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../../shared/ui/button/button';
import { CountUp } from '../../../shared/ui/count-up/count-up';
import { Icon } from '../../../shared/ui/icon/icon';
import { Mascot } from '../../../shared/ui/mascot/mascot';
import { CodeWindow } from '../components/code-window';
import { HERO_CODE, HERO_STATS, HERO_TESTS } from '../landing-content';
import { LanguageMarquee } from './language-marquee';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, CountUp, Icon, Mascot, CodeWindow, LanguageMarquee],
  host: { class: 'relative block overflow-hidden' },
  template: `
    <!-- Soft teal glow behind the hero -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(var(--c-primary)/0.18),transparent)]"
      aria-hidden="true"
    ></div>

    <div class="container-page relative flex flex-col items-center pt-12 text-center sm:pt-16">
      <h1 class="text-balance max-w-3xl text-[40px] font-extrabold leading-[1.05] sm:text-6xl">
        Learn to code<span class="tight-comma">,</span> one small
        <span class="text-primary">win</span> a day
      </h1>
      <p class="mt-5 max-w-xl text-lg leading-8 text-muted">
        Join
        <strong class="font-semibold text-text" [appCountUp]="stats.learners"></strong> learners
        building real skills in Python, JavaScript, C++, Java and C#, five focused minutes at a
        time.
      </p>

      <div class="mt-8 flex w-full max-w-sm flex-col gap-3">
        <a appButton size="lg" routerLink="/register" [block]="true">Get Started</a>
        <a appButton variant="secondary" routerLink="/login" [block]="true"
          >I already have an account</a
        >
      </div>
      <p class="mt-4 flex items-center gap-1.5 text-sm text-muted">
        <app-icon name="check-circle" [size]="16" class="text-success" />
        Free to start. Runs in your browser.
      </p>

      <!-- Visual: owl peeking over the editor mock -->
      <div class="relative mt-28 w-full max-w-3xl">
        <app-mascot
          pose="happy"
          [size]="112"
          class="absolute -top-[84px] left-1/2 z-10 -translate-x-1/2"
        />
        <div class="mock-window relative text-left">
          <div class="mock-header">
            <span class="mock-chip"
              ><span class="h-2 w-2 rounded-full bg-primary"></span>greet.py</span
            >
            <span class="flex gap-2">
              <span class="mock-chip hidden sm:inline-flex"
                ><app-icon name="lightbulb" [size]="14" />Hint</span
              >
              <span class="mock-chip bg-primary text-primary-contrast">
                <app-icon name="play" [size]="14" [filled]="true" />Run
              </span>
            </span>
          </div>
          <app-code-window [lines]="code" label="Python exercise: a greet function" />
          <div
            class="flex flex-wrap items-center gap-2 border-t px-4 py-3"
            style="border-color: var(--mock-border)"
          >
            <span
              class="mr-1 text-xs font-bold uppercase tracking-wider"
              style="color: var(--mock-muted)"
              >Tests</span
            >
            @for (test of tests; track test.label) {
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                [class]="test.passed ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
              >
                <app-icon [name]="test.passed ? 'check-circle' : 'x-circle'" [size]="14" />
                {{ test.label }} {{ test.passed ? 'passed' : 'failed' }}
              </span>
            }
          </div>
        </div>

        <!-- Live counter pill -->
        <div
          class="absolute -bottom-5 left-4 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted shadow-modal sm:left-6"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"
            ></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
          </span>
          <span class="font-bold uppercase text-success">Live</span>
          <span
            ><strong class="font-semibold text-text" [appCountUp]="stats.codeRunsToday"></strong>
            code runs today</span
          >
        </div>
      </div>
    </div>

    <app-language-marquee class="mt-16" />
  `,
})
export class Hero {
  protected readonly stats = HERO_STATS;
  protected readonly code = HERO_CODE;
  protected readonly tests = HERO_TESTS;
}
