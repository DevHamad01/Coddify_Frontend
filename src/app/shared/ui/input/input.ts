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
  template: `
    <label [for]="id" class="mb-1.5 block text-sm font-medium text-text">{{ label() }}</label>
    <div class="relative">
      @if (icon(); as leading) {
        <app-icon
          [name]="leading"
          [size]="18"
          class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
      }
      <input
        [id]="id"
        [type]="effectiveType()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.inputmode]="type() === 'email' ? 'email' : null"
        [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-required]="required() ? 'true' : null"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="h-12 w-full rounded-input border bg-surface px-3.5 text-[15px] text-text placeholder:text-muted/70 transition-colors duration-hover focus:outline-none focus:ring-2 disabled:opacity-60"
        [class]="stateClasses()"
      />
      @if (type() === 'password') {
        <button
          type="button"
          class="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-text"
          [attr.aria-label]="revealed() ? 'Hide password' : 'Show password'"
          [attr.aria-pressed]="revealed()"
          [attr.aria-controls]="id"
          (click)="revealed.set(!revealed())"
        >
          <app-icon [name]="revealed() ? 'eye-off' : 'eye'" [size]="18" />
        </button>
      }
    </div>
    @if (error()) {
      <p
        [id]="id + '-error'"
        class="mt-1.5 flex items-center gap-1.5 text-sm text-danger"
        role="alert"
      >
        <app-icon name="alert-circle" [size]="16" />
        {{ error() }}
      </p>
    } @else if (hint()) {
      <p [id]="id + '-hint'" class="mt-1.5 text-sm text-muted">{{ hint() }}</p>
    }
    <ng-content />
  `,
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
