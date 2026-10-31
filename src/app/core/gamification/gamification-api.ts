import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../api/api-endpoints';
import { ApiError } from '../api/api-error';
import { MockDb } from '../api/mock/mock-db';
import { MockProgress } from '../api/mock/mock-progress';
import { AuthService } from '../auth/auth.service';
import { APP_ENV } from '../config/environment';
import { COSMETICS, DEFAULT_EQUIPPED } from './mock/cosmetics.mock';
import {
  Leaderboard,
  LeaderboardScope,
  MissionsSummary,
  ProfileSummary,
  EquippedItems,
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
  quoteOfTheDay,
  levelFor,
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
}

const XP_MISSION_TARGET = 50;
const STREAK_CLUB_TARGET = 3;
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
    return this.db.respond(() => {
      const user = this.auth.user();
      const state = this.progress.get();
      const level = levelFor(state.totalXp);
      const equipped = this.equipped();
      const title = COSMETICS.find((item) => item.id === equipped.title)?.name ?? '';
      return {
        userId: user?.id ?? 'me',
        fullName: user?.fullName ?? 'Coddify learner',
        username: null,
        title,
        following: 0,
        followers: 0,
        streak: state.streak,
        totalXp: state.totalXp,
        league: state.totalXp >= LEADERBOARD_UNLOCK_XP ? 'Starter League' : null,
        level: level.level,
        levelName: level.name,
        collectionUnlocked: this.allItems().filter((item) => item.state !== 'locked').length,
        collectionTotal: COSMETICS.length,
        historyUnlockXp: 100,
        badges: badgesFor(state),
        joinedAt: '2026-10-01',
      };
    });
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
