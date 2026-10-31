import { UnlockMetric, UnlockRule } from './gamification.models';

const GOAL: Record<UnlockMetric, (target: number) => string> = {
  xp: (target) => `Earn ${target.toLocaleString('en')} XP`,
  level: (target) => `Reach level ${target}`,
  streak: (target) => `Reach a ${target} day streak`,
  lessons: (target) => `Complete ${target} lesson${target === 1 ? '' : 's'}`,
  solved: (target) => `Solve ${target} problem${target === 1 ? '' : 's'}`,
};

const UNIT: Record<UnlockMetric, string> = {
  xp: 'XP',
  level: 'level',
  streak: 'days',
  lessons: 'lessons',
  solved: 'solved',
};

/** "Reach a 7 day streak" for the item's unlock goal. */
export function unlockGoal(rule: UnlockRule): string {
  return GOAL[rule.metric](rule.target);
}

/** "3 / 7 days" progress towards the goal. */
export function unlockProgress(rule: UnlockRule, progress: number): string {
  return `${Math.min(progress, rule.target).toLocaleString('en')} / ${rule.target.toLocaleString('en')} ${UNIT[rule.metric]}`;
}
