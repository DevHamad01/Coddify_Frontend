/** DTOs shared by the HTTP and mock gamification APIs. Field names match the backend's camelCase JSON. */
import { TechId } from '../../shared/data/tech';

export interface UserStats {
  readonly courseId: TechId;
  readonly streak: number;
  readonly gems: number;
  readonly totalXp: number;
  readonly level: number;
  readonly levelName: string;
  /** XP earned inside the current level and XP the level needs in total. */
  readonly levelXp: number;
  readonly levelXpTarget: number;
  readonly dailyGoal: number | null;
  readonly activitiesToday: number;
  /** Leaderboards unlock at this much total XP. */
  readonly leaderboardUnlockXp: number;
  /** Equipped cosmetics, so the editor theme, tutor and frame apply app-wide. */
  readonly equipped: EquippedItems;
}

export interface StreakSummary {
  readonly streak: number;
  readonly longestStreak: number;
  /** True once today's first activity is done (the flame lights up). */
  readonly activeToday: boolean;
  /** yyyy-mm-dd of every day with at least one completed activity. */
  readonly activeDays: readonly string[];
  /** Streak length that joins the Streak Club. */
  readonly clubTarget: number;
}

export interface DailyMission {
  readonly id: string;
  readonly title: string;
  readonly progress: number;
  readonly target: number;
}

export interface MissionsSummary {
  readonly missions: readonly DailyMission[];
  readonly marks: number;
  /** ISO time when today's missions reset. */
  readonly resetsAt: string;
  readonly quote: { readonly text: string; readonly author: string; readonly likes: number };
}

export type LeaderboardScope = 'league' | 'friends';

export interface LeaderboardEntry {
  readonly rank: number;
  readonly userId: string;
  readonly name: string;
  readonly xp: number;
  readonly isMe: boolean;
  readonly isPrivate?: boolean;
}

export interface Leaderboard {
  readonly scope: LeaderboardScope;
  readonly leagueName: string;
  /** Ranks 1..promotionCutoff move up a league at the end of the week. */
  readonly promotionCutoff: number;
  readonly endsAt: string;
  readonly entries: readonly LeaderboardEntry[];
}

export type StoreTab = 'themes' | 'tutors' | 'profile';
export type ProfileItemKind = 'title' | 'frame' | 'name-effect' | 'streak-flame';
export type StoreItemKind = ProfileItemKind | 'theme' | 'tutor';
export type StoreItemState = 'equipped' | 'unlocked' | 'locked';

/** What a learner has to reach to unlock an item. Nothing is ever bought: Coddify is free. */
export type UnlockMetric = 'xp' | 'level' | 'streak' | 'lessons' | 'solved';

export interface UnlockRule {
  readonly metric: UnlockMetric;
  readonly target: number;
}

export interface StoreItem {
  readonly id: string;
  readonly tab: StoreTab;
  readonly kind: StoreItemKind;
  readonly name: string;
  readonly description: string;
  readonly state: StoreItemState;
  /** null: available from the start. */
  readonly unlock: UnlockRule | null;
  /** The learner's current value for the unlock metric (for the progress bar). */
  readonly progress: number;
  /** Key the store and profile views use to draw the item (icon, frame style, tutor look…). */
  readonly art: string;
  readonly rarity: 'common' | 'rare' | 'legendary';
}

/** The item equipped in each slot. */
export type EquippedItems = Readonly<Record<StoreItemKind, string>>;

export interface Badge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly progress: number;
  readonly target: number;
  readonly tier: number;
  readonly maxTier: number;
}

export interface ProfileSummary {
  readonly userId: string;
  readonly fullName: string;
  readonly username: string | null;
  readonly title: string;
  readonly following: number;
  readonly followers: number;
  readonly streak: number;
  readonly totalXp: number;
  readonly league: string | null;
  readonly level: number;
  readonly levelName: string;
  readonly collectionUnlocked: number;
  readonly collectionTotal: number;
  readonly historyUnlockXp: number;
  readonly badges: readonly Badge[];
  readonly joinedAt: string;
}
