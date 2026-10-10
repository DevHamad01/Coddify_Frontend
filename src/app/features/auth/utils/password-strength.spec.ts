import { FormControl, FormGroup } from '@angular/forms';

import { evaluatePassword, matchFieldsValidator, strongPasswordValidator } from './password-strength';

describe('evaluatePassword', () => {
  it('returns an empty label and score 0 for an empty password', () => {
    const result = evaluatePassword('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('');
    expect(result.isValid).toBe(false);
  });

  it('checks each rule independently', () => {
    expect(evaluatePassword('abc').checks).toEqual({ minLength: false, upper: false, lower: true, number: false });
    expect(evaluatePassword('ABCDEFGH').checks).toEqual({ minLength: true, upper: true, lower: false, number: false });
    expect(evaluatePassword('12345678').checks).toEqual({ minLength: true, upper: false, lower: false, number: true });
  });

  it.each([
    ['a', 1, 'Too weak'],
    ['abcdefgh', 2, 'Weak'],
    ['Abcdefgh', 3, 'Almost there'],
    ['Abcdefg1', 4, 'Strong'],
  ])('scores %s as %i (%s)', (password, score, label) => {
    const result = evaluatePassword(password);
    expect(result.score).toBe(score);
    expect(result.label).toBe(label);
  });

  it('is only valid when every rule passes', () => {
    expect(evaluatePassword('Coddify1').isValid).toBe(true);
    expect(evaluatePassword('Coddify').isValid).toBe(false);
    expect(evaluatePassword('coddify123').isValid).toBe(false);
  });
});

describe('password validators', () => {
  it('strongPasswordValidator flags weak passwords', () => {
    expect(strongPasswordValidator(new FormControl('weak'))).toEqual({ weakPassword: true });
    expect(strongPasswordValidator(new FormControl('Str0ngPass'))).toBeNull();
  });

  it('matchFieldsValidator only complains once confirm has a value', () => {
    const group = new FormGroup(
      { password: new FormControl('Str0ngPass'), confirm: new FormControl('') },
      { validators: matchFieldsValidator('password', 'confirm') },
    );
    expect(group.hasError('passwordMismatch')).toBe(false);

    group.controls.confirm.setValue('Different1');
    expect(group.hasError('passwordMismatch')).toBe(true);

    group.controls.confirm.setValue('Str0ngPass');
    expect(group.hasError('passwordMismatch')).toBe(false);
  });
});
