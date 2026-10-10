import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideApis } from '../../../../core/providers';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideApis()],
    }).compileComponents();
  });

  it('shows inline errors and keeps the form when submitted empty', async () => {
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('form button[type=submit]')?.click();
    await fixture.whenStable();

    const errors = Array.from(el.querySelectorAll('[role=alert]')).map((node) =>
      node.textContent?.trim(),
    );
    expect(errors).toContain('Enter your email address.');
    expect(errors).toContain('Enter your password.');
    expect(el.querySelector('input[type=email]')?.getAttribute('aria-invalid')).toBe('true');
  });
});
