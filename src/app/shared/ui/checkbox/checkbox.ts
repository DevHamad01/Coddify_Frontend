import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Icon } from '../icon/icon';

let nextId = 0;

/** Native checkbox (keeps keyboard + screen reader behaviour) with a custom box. Label is projected. */
@Component({
  selector: 'app-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true }],
  host: { class: 'block' },
  template: `
    <div class="flex items-start gap-3">
      <span class="relative mt-0.5 flex h-5 w-5 shrink-0">
        <input
          type="checkbox"
          [id]="id"
          [checked]="checked()"
          [disabled]="disabled()"
          [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-describedby]="error() ? id + '-error' : null"
          (change)="onToggle($event)"
          (blur)="onTouched()"
          class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-surface transition-colors duration-hover checked:border-primary checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          [class.border-border]="!error()"
          [class.border-danger]="!!error()"
        />
        <app-icon
          name="check"
          [size]="14"
          [strokeWidth]="3"
          class="pointer-events-none absolute inset-0 m-auto hidden text-primary-contrast peer-checked:flex"
        />
      </span>
      <label [for]="id" class="cursor-pointer text-sm leading-6 text-muted"><ng-content /></label>
    </div>
    @if (error()) {
      <p [id]="id + '-error'" class="ml-8 mt-1 text-sm text-danger" role="alert">{{ error() }}</p>
    }
  `,
})
export class Checkbox implements ControlValueAccessor {
  readonly error = input<string | null>(null);

  protected readonly id = `app-checkbox-${nextId++}`;
  protected readonly checked = signal(false);
  protected readonly disabled = signal(false);

  private onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onToggle(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
