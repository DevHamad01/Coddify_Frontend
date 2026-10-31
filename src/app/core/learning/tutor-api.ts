import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { MockDb } from '../api/mock/mock-db';
import { APP_ENV } from '../config/environment';
import { RunResult } from './learning.models';
import { PYTHON_LESSONS } from './mock/python-course.mock';

export interface TutorRequest {
  readonly lessonId: string;
  readonly message: string;
  readonly code: string;
  readonly lastRun: RunResult | null;
}

export interface TutorReply {
  readonly text: string;
}

/** AI tutor chat ("Bit"). Gives hints, never full solutions. Bound in `provideApis()`. */
export abstract class TutorApi {
  abstract ask(request: TutorRequest): Observable<TutorReply>;
}

@Injectable({ providedIn: 'root' })
export class HttpTutorApi extends TutorApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;

  ask(request: TutorRequest): Observable<TutorReply> {
    return this.http.post<TutorReply>(this.baseUrl + API_ENDPOINTS.tutor.chat, request);
  }
}

/** Rule-based stand-in for the LLM: reads the lesson, the learner's last run and the question. */
@Injectable({ providedIn: 'root' })
export class MockTutorApi extends TutorApi {
  private readonly db = inject(MockDb);

  ask(request: TutorRequest): Observable<TutorReply> {
    return this.db.respond(() => ({ text: this.reply(request) }));
  }

  private reply({ lessonId, message, lastRun }: TutorRequest): string {
    const lesson = PYTHON_LESSONS.get(lessonId);
    const challenge = lesson?.challenge;
    const question = message.toLowerCase();

    if (question.includes('explain') && challenge) {
      const steps = challenge.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
      return `Sure! ${challenge.intro}\n\nHere is the plan:\n${steps}\n\nTry the first step, then press Run Code. I'll be right here.`;
    }
    if (lastRun?.error) {
      const error = lastRun.error.split('\n').pop() ?? lastRun.error;
      if (error.startsWith('NameError') || error.startsWith('ReferenceError')) {
        return `Python doesn't know one of your names yet:\n\`${error}\`\n\nCheck the spelling, and make sure the variable gets a value (with \`=\`) on a line *above* where you use it.`;
      }
      if (error.startsWith('SyntaxError')) {
        return `That's a syntax error:\n\`${error}\`\n\nLook for a missing quote or bracket, or a space inside a name. Variable names can't contain spaces, use \`snake_case\` instead.`;
      }
      if (error.startsWith('TypeError')) {
        return `Mixing types there:\n\`${error}\`\n\nText and numbers can't be added with \`+\`. Try an f-string like \`f"{value}"\` instead.`;
      }
      return `Your code stopped with:\n\`${error}\`\n\nRead the line number in the message and check that line first.`;
    }
    if (lastRun && !lastRun.passed && challenge) {
      const expected = challenge.tests.find((test) => test.expectedOutput !== null)?.expectedOutput;
      return expected
        ? `Close! Your output was:\n\`${lastRun.output || '(nothing)'}\`\n\nThe test expects:\n\`${expected}\`\n\nCompare them character by character: spacing and capital letters count.`
        : 'Run the code once more and check the output panel.';
    }
    if (lastRun?.passed) {
      return 'All tests pass. Nice work! 🎉 Want a challenge? Try changing the code and predict the output before you run it.';
    }
    if (challenge) {
      return `Let's start small. ${challenge.steps[0].replace(/\*\*/g, '')}\n\nWhen you're ready, press **Run Code** and tell me what you see.`;
    }
    return "I'm Bit, your AI tutor. Ask me about this lesson, an error, or for a hint.";
  }
}
