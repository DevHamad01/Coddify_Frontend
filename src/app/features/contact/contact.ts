import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EMAIL_MESSAGES, fieldError } from '../../shared/forms/field-error';
import { Alert } from '../../shared/ui/alert/alert';
import { Button } from '../../shared/ui/button/button';
import { Checkbox } from '../../shared/ui/checkbox/checkbox';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';
import { Input } from '../../shared/ui/input/input';

const SUPPORT_EMAIL = 'support@coddify.dev';

const TOPICS = ['General question', 'Bug report', 'Course feedback', 'Partnership', 'Privacy'];

const CHANNELS: readonly { label: string; email: string }[] = [
  { label: 'Help and feedback', email: SUPPORT_EMAIL },
  { label: 'Privacy and data', email: 'privacy@coddify.dev' },
  { label: 'Universities and partners', email: 'partners@coddify.dev' },
];

/** Social profiles are placeholders until the official accounts exist. */
const SOCIALS: readonly { label: string; icon: IconName }[] = [
  { label: 'Coddify on Instagram (coming soon)', icon: 'instagram' },
  { label: 'Coddify on YouTube (coming soon)', icon: 'youtube' },
  { label: 'Coddify on LinkedIn (coming soon)', icon: 'linkedin' },
];

/**
 * Contact form. There is no contact API yet, so sending opens the learner's email app with
 * the message filled in, addressed to support.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Alert, Button, Checkbox, Icon, Input],
  host: { class: 'block' },
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly document = inject(DOCUMENT);

  protected readonly topics = TOPICS;
  protected readonly channels = CHANNELS;
  protected readonly socials = SOCIALS;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    topic: [TOPICS[0]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    understood: [false, Validators.requiredTrue],
  });
  protected readonly submitted = signal(false);
  protected readonly opened = signal(false);

  protected nameError(): string | null {
    return fieldError(this.form.controls.name, { required: 'Tell us your name.' }, this.submitted());
  }

  protected emailError(): string | null {
    return fieldError(this.form.controls.email, EMAIL_MESSAGES, this.submitted());
  }

  protected messageError(): string | null {
    return fieldError(
      this.form.controls.message,
      {
        required: 'Write your message.',
        minlength: 'Add a little more detail (at least 10 characters).',
        maxlength: 'Keep it under 2000 characters.',
      },
      this.submitted(),
    );
  }

  protected understoodError(): string | null {
    return fieldError(
      this.form.controls.understood,
      { required: 'Please tick this box to continue.' },
      this.submitted(),
    );
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, topic, message } = this.form.getRawValue();
    const subject = `[${topic}] Message from ${name.trim()}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    this.document.location.href =
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    this.opened.set(true);
  }
}
