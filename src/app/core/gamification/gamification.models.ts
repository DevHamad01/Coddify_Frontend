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

export type StoreTab = 'boosts' | 'themes' | 'tutors' | 'profile';
export type ProfileItemKind = 'title' | 'frame' | 'name-effect' | 'streak-flame';
export type StoreItemState = 'equipped' | 'owned' | 'buyable' | 'locked';

export interface StoreItem {
  readonly id: string;
  readonly tab: StoreTab;
  readonly kind: ProfileItemKind | 'boost' | 'theme' | 'tutor';
  readonly name: string;
  readonly description: string;
  readonly state: StoreItemState;
  readonly price?: number;
  /** Shown on locked items, e.g. "7+ day streak". */
  readonly requirement?: string;
  /** Icon key the store view knows how to draw. */
  readonly art: string;
}

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
