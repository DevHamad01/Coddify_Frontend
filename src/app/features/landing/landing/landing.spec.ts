import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Landing } from './landing';

describe('Landing', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders exactly one h1 and sets SEO tags', async () => {
    const fixture = TestBed.createComponent(Landing);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(TestBed.inject(Title).getTitle()).toContain('Coddify');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toContain('AI tutor');
    expect(TestBed.inject(Meta).getTag('property="og:title"')).not.toBeNull();
  });

  it('renders the FAQ with six questions', async () => {
    const fixture = TestBed.createComponent(Landing);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('#faq button[aria-expanded]').length).toBe(6);
  });
});
