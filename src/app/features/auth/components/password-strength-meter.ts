import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Icon } from '../../../shared/ui/icon/icon';
import { PASSWORD_MIN_LENGTH, PasswordChecks, evaluatePassword } from '../utils/password-strength';

const RULES: readonly { key: keyof PasswordChecks; label: string }[] = [
  { key: 'minLength', label: `${PASSWORD_MIN_LENGTH}+ characters` },
  { key: 'upper', label: 'Uppercase letter' },
  { key: 'lower', label: 'Lowercase letter' },
  { key: 'number', label: 'Number' },
];

const BAR_COLOR = ['bg-border', 'bg-danger', 'bg-streak', 'bg-xp', 'bg-success'];

@Component({
  selector: 'app-password-strength-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'mt-2.5 block' },
  template: `
    <div class="flex items-center gap-3">
      <div class="grid flex-1 grid-cols-4 gap-1.5" aria-hidden="true">
        @for (bar of bars; track bar) {
          <span
            class="h-1.5 rounded-full transition-colors duration-panel"
            [class]="bar < strength().score ? color() : 'bg-border'"
          ></span>
        }
      </div>
      <span class="w-24 text-right text-xs font-semibold text-muted" aria-live="polite">{{
        strength().label
      }}</span>
    </div>
    <ul class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs" aria-label="Password requirements">
      @for (rule of rules; track rule.key) {
        <li
          class="flex items-center gap-1.5"
          [class]="strength().checks[rule.key] ? 'text-success' : 'text-muted'"
        >
          <app-icon
            [name]="strength().checks[rule.key] ? 'check-circle' : 'x-circle'"
            [size]="14"
          />
          {{ rule.label }}
          <span class="sr-only">{{ strength().checks[rule.key] ? '(met)' : '(not met)' }}</span>
        </li>
      }
    </ul>
  `,
})
export class PasswordStrengthMeter {
  readonly password = input.required<string>();

  protected readonly rules = RULES;
  protected readonly bars = [0, 1, 2, 3];
  protected readonly strength = computed(() => evaluatePassword(this.password()));
  protected readonly color = computed(() => BAR_COLOR[this.strength().score]);
}
