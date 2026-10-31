import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Icon } from '../../../../shared/ui/icon/icon';
import {
  PASSWORD_MIN_LENGTH,
  PasswordChecks,
  evaluatePassword,
} from '../../utils/password-strength';

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
  templateUrl: './password-strength-meter.html',
  styleUrl: './password-strength-meter.scss',
})
export class PasswordStrengthMeter {
  readonly password = input.required<string>();

  protected readonly rules = RULES;
  protected readonly bars = [0, 1, 2, 3];
  protected readonly strength = computed(() => evaluatePassword(this.password()));
  protected readonly color = computed(() => BAR_COLOR[this.strength().score]);
}
