import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideApis } from '../../../../core/providers';
import { Register } from './register';

function type(input: HTMLInputElement | null, value: string): void {
  if (!input) {
    throw new Error('input not found');
  }
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
}

describe('Register', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideApis()],
    }).compileComponents();
  });

  it('flags a weak password and a mismatched confirmation', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const passwords = el.querySelectorAll<HTMLInputElement>('input[autocomplete=new-password]');

    type(passwords[0], 'short');
    type(passwords[1], 'different');
    await fixture.whenStable();

    const text = el.textContent ?? '';
    expect(text).toContain('Use 8+ characters with upper and lower case letters and a number.');
    expect(text).toContain('Passwords do not match.');
    expect(text).toContain('Too weak');
  });
});
