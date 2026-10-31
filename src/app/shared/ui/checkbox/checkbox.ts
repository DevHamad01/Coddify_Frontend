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
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
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
