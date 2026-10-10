import { CompleteOnboardingAnswers } from '../../core/onboarding/onboarding.models';
import { recommendCourse } from './recommend-course';

const base: CompleteOnboardingAnswers = {
  goal: 'fun',
  language: 'unsure',
  experience: 'beginner',
  dailyMinutes: 10,
};

describe('recommendCourse', () => {
  it('always respects an explicit language choice', () => {
    expect(recommendCourse({ ...base, language: 'csharp', goal: 'freelancing' }).language.id).toBe(
      'csharp',
    );
    expect(recommendCourse({ ...base, language: 'java' }).language.id).toBe('java');
  });

  it('gives Python to beginners without a preference', () => {
    expect(recommendCourse(base).language.id).toBe('python');
    expect(recommendCourse({ ...base, goal: 'university' }).language.id).toBe('python');
    expect(recommendCourse({ ...base, goal: 'job' }).language.id).toBe('python');
  });

  it('gives JavaScript for the web/freelancing goal, even to beginners', () => {
    expect(recommendCourse({ ...base, goal: 'freelancing' }).language.id).toBe('javascript');
    expect(
      recommendCourse({ ...base, goal: 'freelancing', experience: 'comfortable' }).language.id,
    ).toBe('javascript');
  });

  it('uses the goal for learners with some experience and no preference', () => {
    expect(recommendCourse({ ...base, goal: 'university', experience: 'some' }).language.id).toBe(
      'cpp',
    );
    expect(recommendCourse({ ...base, goal: 'job', experience: 'comfortable' }).language.id).toBe(
      'java',
    );
    expect(recommendCourse({ ...base, goal: 'fun', experience: 'some' }).language.id).toBe(
      'python',
    );
  });

  it('names the course after the language and experience level', () => {
    expect(recommendCourse(base).courseTitle).toBe('Python Foundations');
    expect(recommendCourse({ ...base, language: 'cpp', experience: 'some' }).courseTitle).toBe(
      'C++ Essentials',
    );
    expect(
      recommendCourse({ ...base, language: 'java', experience: 'comfortable' }).courseTitle,
    ).toBe('Java Problem Solving');
  });

  it('estimates fewer weeks for a bigger daily target', () => {
    expect(recommendCourse({ ...base, dailyMinutes: 5 }).estimatedWeeks).toBe(18);
    expect(recommendCourse({ ...base, dailyMinutes: 10 }).estimatedWeeks).toBe(9);
    expect(recommendCourse({ ...base, dailyMinutes: 20 }).estimatedWeeks).toBe(5);
  });

  it('always returns three reasons', () => {
    for (const language of ['python', 'javascript', 'cpp', 'java', 'csharp'] as const) {
      expect(recommendCourse({ ...base, language }).reasons).toHaveLength(3);
    }
  });
});
