import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

let nextId = 0;

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

/**
 * Labelled text field for reactive forms. The parent decides when to show `error`
 * (usually after blur or submit), keeping validation copy next to the form logic.
 */
@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Input), multi: true }],
  host: { class: 'block' },
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<InputType>('text');
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string | null>(null);
  readonly icon = input<IconName | null>(null);
  readonly required = input<boolean>(false);

  protected readonly id = `app-input-${nextId++}`;
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly revealed = signal(false);

  protected readonly effectiveType = computed(() =>
    this.type() === 'password' && this.revealed() ? 'text' : this.type(),
  );
  protected readonly stateClasses = computed(() =>
    [
      this.icon() ? 'pl-10' : '',
      this.type() === 'password' ? 'pr-11' : '',
      this.error()
        ? 'border-danger focus:ring-danger/30'
        : 'border-border focus:border-primary focus:ring-primary/30',
    ].join(' '),
  );
  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return `${this.id}-error`;
    }
    return this.hint() ? `${this.id}-hint` : null;
  });

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }
}
