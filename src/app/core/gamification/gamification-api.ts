import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApiError } from '../api/api-error';
import { MockDb } from '../api/mock/mock-db';
import { MockProgress } from '../api/mock/mock-progress';
import { AuthService } from '../auth/auth.service';
import { APP_ENV } from '../config/environment';
import { AvatarLook, DEFAULT_AVATAR } from '../../shared/data/avatar-parts';
import { COSMETICS, DEFAULT_EQUIPPED } from './mock/cosmetics.mock';
import {
  Leaderboard,
  LeaderboardScope,
  MissionsSummary,
  ProfileSummary,
  EquippedItems,
  LevelsSummary,
  ProfileUpdate,
  StoreItem,
  StoreTab,
  UnlockMetric,
  StreakSummary,
  UserStats,
} from './gamification.models';
import {
  badgesFor,
  FRIENDS,
  LEAGUE_RIVALS,
  LEVEL_NAMES,
  LEVEL_TIERS,
  levelFor,
  quoteOfTheDay,
  xpToReach,
} from './mock/gamification.mock';

/** Streak, XP, missions, leaderboards, store and profile; bound in `provideApis()`. */
export abstract class GamificationApi {
  abstract getStats(): Observable<UserStats>;
  /** null removes the daily goal. */
  abstract setDailyGoal(activities: number | null): Observable<UserStats>;
  abstract getStreak(): Observable<StreakSummary>;
  abstract getMissions(): Observable<MissionsSummary>;
  abstract getLeaderboard(scope: LeaderboardScope): Observable<Leaderboard>;
  abstract getStore(tab: StoreTab): Observable<readonly StoreItem[]>;
  abstract equip(itemId: string): Observable<readonly StoreItem[]>;
  abstract getProfile(): Observable<ProfileSummary>;
  abstract updateProfile(update: ProfileUpdate): Observable<ProfileSummary>;
  /** Pins up to five unlocked cosmetics to the profile, in this order. */
  abstract setShowcase(itemIds: readonly string[]): Observable<ProfileSummary>;
  /** Every cosmetic with its unlock state (the profile collection). */
  abstract getCollection(): Observable<readonly StoreItem[]>;
  abstract getLevels(): Observable<LevelsSummary>;
  abstract setAvatar(look: AvatarLook): Observable<ProfileSummary>;
}

@Injectable({ providedIn: 'root' })
export class HttpGamificationApi extends GamificationApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENV).apiBaseUrl;
  private readonly urls = API_ENDPOINTS.gamification;

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(this.baseUrl + this.urls.stats);
  }

  setDailyGoal(activities: number | null): Observable<UserStats> {
    return this.http.put<UserStats>(this.baseUrl + this.urls.dailyGoal, { activities });
  }

  getStreak(): Observable<StreakSummary> {
    return this.http.get<StreakSummary>(this.baseUrl + this.urls.streak);
  }

  getMissions(): Observable<MissionsSummary> {
    return this.http.get<MissionsSummary>(this.baseUrl + this.urls.missions);
  }

  getLeaderboard(scope: LeaderboardScope): Observable<Leaderboard> {
    return this.http.get<Leaderboard>(this.baseUrl + this.urls.leaderboard(scope));
  }

  getStore(tab: StoreTab): Observable<readonly StoreItem[]> {
    return this.http.get<StoreItem[]>(this.baseUrl + this.urls.store(tab));
  }

  equip(itemId: string): Observable<readonly StoreItem[]> {
    return this.http.post<StoreItem[]>(this.baseUrl + this.urls.equip(itemId), {});
  }

  getProfile(): Observable<ProfileSummary> {
    return this.http.get<ProfileSummary>(this.baseUrl + this.urls.profile);
  }

  updateProfile(update: ProfileUpdate): Observable<ProfileSummary> {
    return this.http.put<ProfileSummary>(this.baseUrl + this.urls.profile, update);
  }

  setShowcase(itemIds: readonly string[]): Observable<ProfileSummary> {
    return this.http.put<ProfileSummary>(this.baseUrl + this.urls.showcase, { itemIds });
  }

  getCollection(): Observable<readonly StoreItem[]> {
    return this.http.get<StoreItem[]>(this.baseUrl + this.urls.collection);
  }

  getLevels(): Observable<LevelsSummary> {
    return this.http.get<LevelsSummary>(this.baseUrl + this.urls.levels);
  }

  setAvatar(look: AvatarLook): Observable<ProfileSummary> {
    return this.http.put<ProfileSummary>(this.baseUrl + this.urls.avatar, look);
  }
}

const XP_MISSION_TARGET = 50;
const STREAK_CLUB_TARGET = 3;
const BIO_LIMIT = 300;
const SHOWCASE_LIMIT = 5;
const LEADERBOARD_UNLOCK_XP = 100;

@Injectable({ providedIn: 'root' })
export class MockGamificationApi extends GamificationApi {
  private readonly db = inject(MockDb);
  private readonly progress = inject(MockProgress);
  private readonly auth = inject(AuthService);

  getStats(): Observable<UserStats> {
    return this.db.respond(() => this.stats());
  }

  setDailyGoal(activities: number | null): Observable<UserStats> {
    return this.db.respond(() => {
      this.progress.update({ dailyGoal: activities });
      return this.stats();
    });
  }

  getStreak(): Observable<StreakSummary> {
    return this.db.respond(() => {
      const state = this.progress.get();
      return {
        streak: state.streak,
        longestStreak: Math.max(state.longestStreak, state.streak),
        activeToday: state.activitiesToday > 0,
        // Progress saved before day history existed still knows its last active day.
        activeDays:
          state.lastActiveDay && !state.activeDays.includes(state.lastActiveDay)
            ? [...state.activeDays, state.lastActiveDay]
            : state.activeDays,
        clubTarget: STREAK_CLUB_TARGET,
      };
    });
  }

  getMissions(): Observable<MissionsSummary> {
    return this.db.respond(() => {
      const state = this.progress.get();
      const missions = [
        {
          id: 'xp',
          title: `Earn ${XP_MISSION_TARGET} XP`,
          progress: Math.min(state.xpToday, XP_MISSION_TARGET),
          target: XP_MISSION_TARGET,
        },
        {
          id: 'activity',
          title: 'Complete one learning activity',
          progress: Math.min(state.activitiesToday, 1),
          target: 1,
        },
        {
          id: 'perfect',
          title: 'Complete an activity perfectly',
          progress: state.perfectToday ? 1 : 0,
          target: 1,
        },
      ];
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      return {
        missions,
        marks: missions.filter((mission) => mission.progress >= mission.target).length,
        resetsAt: midnight.toISOString(),
        quote: quoteOfTheDay(),
      };
    });
  }

  getLeaderboard(scope: LeaderboardScope): Observable<Leaderboard> {
    return this.db.respond(() => {
      const me = {
        userId: 'me',
        name: this.auth.user()?.fullName ?? 'You',
        xp: this.progress.get().totalXp,
        isMe: true,
      };
      const others = scope === 'league' ? LEAGUE_RIVALS : FRIENDS;
      const entries = [...others.map((rival) => ({ ...rival, isMe: false })), me]
        .sort((a, b) => b.xp - a.xp)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      const sunday = new Date();
      sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7 || 7));
      sunday.setHours(23, 59, 0, 0);
      return {
        scope,
        leagueName: 'Starter League',
        promotionCutoff: 7,
        endsAt: sunday.toISOString(),
        entries,
      };
    });
  }

  getStore(tab: StoreTab): Observable<readonly StoreItem[]> {
    return this.db.respond(() => this.storeItems(tab));
  }

  equip(itemId: string): Observable<readonly StoreItem[]> {
    return this.db.respond(() => {
      const item = this.allItems().find((candidate) => candidate.id === itemId);
      if (!item || item.state === 'locked') {
        throw new ApiError('validation', 'Reach the goal first to unlock that item.', 400);
      }
      const state = this.progress.get();
      this.progress.update({ equipped: { ...state.equipped, [item.kind]: itemId } });
      return this.storeItems(item.tab);
    });
  }

  getProfile(): Observable<ProfileSummary> {
    return this.db.respond(() => this.profile());
  }

  updateProfile(update: ProfileUpdate): Observable<ProfileSummary> {
    return this.db.respond(() => {
      const username = update.username?.trim() || null;
      if (username && !/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        throw new ApiError(
          'validation',
          'Usernames are 3 to 20 letters and numbers, with no spaces.',
          400,
        );
      }
      this.auth.updateFullName(update.fullName.trim());
      this.progress.update({
        username,
        bio: update.bio.slice(0, BIO_LIMIT),
        socials: Object.fromEntries(
          Object.entries(update.socials).filter(([, url]) => !!url?.trim()),
        ) as Record<string, string>,
      });
      return this.profile();
    });
  }

  setShowcase(itemIds: readonly string[]): Observable<ProfileSummary> {
    return this.db.respond(() => {
      const unlocked = new Set(
        this.allItems()
          .filter((item) => item.state !== 'locked')
          .map((item) => item.id),
      );
      this.progress.update({
        showcase: itemIds.filter((id) => unlocked.has(id)).slice(0, SHOWCASE_LIMIT),
      });
      return this.profile();
    });
  }

  getCollection(): Observable<readonly StoreItem[]> {
    return this.db.respond(() => this.allItems());
  }

  getLevels(): Observable<LevelsSummary> {
    return this.db.respond(() => {
      const state = this.progress.get();
      const current = levelFor(state.totalXp);
      const rewardsAt = new Map<number, string[]>();
      for (const item of COSMETICS) {
        if (item.unlock?.metric === 'level') {
          rewardsAt.set(item.unlock.target, [
            ...(rewardsAt.get(item.unlock.target) ?? []),
            item.name,
          ]);
        }
      }
      return {
        level: current.level,
        tierName: current.name,
        totalXp: state.totalXp,
        xpIntoLevel: current.xpIntoLevel,
        xpForLevel: current.xpForLevel,
        nextLevelName: LEVEL_NAMES[current.level] ?? 'Max level',
        tiers: LEVEL_TIERS.map((tier) => ({
          ...tier,
          levels: Array.from({ length: tier.to - tier.from + 1 }, (_, i) => {
            const level = tier.from + i;
            return {
              level,
              name: LEVEL_NAMES[level - 1],
              totalXp: xpToReach(level),
              rewards: rewardsAt.get(level) ?? [],
              reached: level <= current.level,
            };
          }),
        })),
      };
    });
  }

  setAvatar(look: AvatarLook): Observable<ProfileSummary> {
    return this.db.respond(() => {
      this.progress.update({ avatar: look });
      return this.profile();
    });
  }

  private profile(): ProfileSummary {
    const user = this.auth.user();
    const state = this.progress.get();
    const level = levelFor(state.totalXp);
    const equipped = this.equipped();
    const items = this.allItems();
    return {
      userId: user?.id ?? 'me',
      email: user?.email ?? '',
      fullName: user?.fullName ?? 'Coddify learner',
      username: state.username,
      bio: state.bio,
      socials: state.socials,
      avatar: state.avatar ?? DEFAULT_AVATAR,
      title: COSMETICS.find((item) => item.id === equipped.title)?.name ?? '',
      equipped,
      showcase: state.showcase
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is StoreItem => !!item),
      following: 0,
      followers: 0,
      streak: state.streak,
      totalXp: state.totalXp,
      league: state.totalXp >= LEADERBOARD_UNLOCK_XP ? 'Starter League' : null,
      level: level.level,
      levelName: level.name,
      collectionUnlocked: items.filter((item) => item.state !== 'locked').length,
      collectionTotal: COSMETICS.length,
      historyUnlockXp: 100,
      badges: badgesFor(state),
      joinedAt: '2026-10-01',
    };
  }

  private stats(): UserStats {
    const state = this.progress.get();
    const level = levelFor(state.totalXp);
    return {
      courseId: state.activeCourse,
      streak: state.streak,
      gems: state.gems,
      totalXp: state.totalXp,
      level: level.level,
      levelName: level.name,
      levelXp: level.xpIntoLevel,
      levelXpTarget: level.xpForLevel,
      dailyGoal: state.dailyGoal,
      activitiesToday: state.activitiesToday,
      leaderboardUnlockXp: LEADERBOARD_UNLOCK_XP,
      equipped: this.equipped(),
    };
  }

  private storeItems(tab: StoreTab): StoreItem[] {
    return this.allItems().filter((item) => item.tab === tab);
  }

  /** Every cosmetic with its state worked out from the learner's progress. */
  private allItems(): StoreItem[] {
    const metrics = this.metrics();
    const equipped = this.equipped();
    return COSMETICS.map((item) => {
      const progress = item.unlock ? metrics[item.unlock.metric] : 0;
      const unlocked = !item.unlock || progress >= item.unlock.target;
      return {
        ...item,
        progress,
        state: equipped[item.kind] === item.id ? 'equipped' : unlocked ? 'unlocked' : 'locked',
      };
    });
  }

  private equipped(): EquippedItems {
    return { ...DEFAULT_EQUIPPED, ...this.progress.get().equipped } as EquippedItems;
  }

  private metrics(): Record<UnlockMetric, number> {
    const state = this.progress.get();
    return {
      xp: state.totalXp,
      level: levelFor(state.totalXp).level,
      streak: Math.max(state.longestStreak, state.streak),
      lessons: state.completedNodes.length,
      solved: state.solvedProblems.length,
    };
  }
}
