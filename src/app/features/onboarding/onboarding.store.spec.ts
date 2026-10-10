import { TestBed } from '@angular/core/testing';

import { INTRO_STEP, OnboardingStore, SUMMARY_STEP } from './onboarding.store';

function createStore(): OnboardingStore {
  TestBed.configureTestingModule({ providers: [OnboardingStore] });
  return TestBed.inject(OnboardingStore);
}

describe('OnboardingStore', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts on the intro with no answers', () => {
    const store = createStore();
    expect(store.step()).toBe(INTRO_STEP);
    expect(store.completeAnswers()).toBeNull();
    expect(store.progress()).toBe(0);
  });

  it('only continues once the current step has an answer', () => {
    const store = createStore();
    store.next(); // intro → goal
    expect(store.currentStep()?.key).toBe('goal');
    expect(store.canContinue()).toBe(false);

    store.next();
    expect(store.currentStep()?.key).toBe('goal');

    store.select('job');
    store.next();
    expect(store.currentStep()?.key).toBe('language');
    expect(store.direction()).toBe(1);
  });

  it('walks to the summary and builds complete answers', () => {
    const store = createStore();
    store.next();
    for (const value of ['university', 'cpp', 'some', 15] as const) {
      store.select(value);
      store.next();
    }
    expect(store.step()).toBe(SUMMARY_STEP);
    expect(store.progress()).toBe(100);
    expect(store.completeAnswers()).toEqual({
      goal: 'university',
      language: 'cpp',
      experience: 'some',
      dailyMinutes: 15,
    });

    store.back();
    expect(store.currentStep()?.key).toBe('dailyMinutes');
    expect(store.direction()).toBe(-1);
  });

  it('restores progress from sessionStorage (same-tab refresh)', () => {
    const first = createStore();
    first.next();
    first.select('fun');
    first.next();
    TestBed.tick(); // flush the persist effect

    TestBed.resetTestingModule();
    const restored = createStore();
    expect(restored.currentStep()?.key).toBe('language');
    expect(restored.answers().goal).toBe('fun');
  });

  it('clear() resets state and storage', () => {
    const store = createStore();
    store.next();
    store.select('job');
    TestBed.tick();
    store.clear();
    expect(store.step()).toBe(INTRO_STEP);
    expect(store.answers().goal).toBeNull();
  });
});
