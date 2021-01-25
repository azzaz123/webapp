import {
  LoadUserStatsByUserIdSuccess,
  LoadUserStatsByUserIdFailed,
} from './../../../../../app/data/user/actions/stats.action';
import { UserIdMother } from './../../domain/profile/user-id.mother';
import { UserId } from './../../../../../app/data/user/domain/profile/user-id';

import { UserStatsMother } from './../../domain/stats/user-stats.mother';
import {
  LoadUserStats,
  LoadUserStatsFailed,
  UserStats,
  LoadUserStatsSuccess,
  LoadUserStatsByUserId,
} from '@data/user';
import * as fromReducer from 'app/data/user/store/reducer/stats.reducer';

describe('Stats Reducer', () => {
  describe('initial state', () => {
    it('should return an default state', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;

      const action = { type: 'Unkown' };

      const state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        action
      );

      expect(state).toEqual(INITIAL_USER_STATS_STATE);
    });
  });

  describe('Load User Stats', () => {
    it('[LoadUserStats] should set loading to true', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;

      const state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStats()
      );

      expect(state.loading).toBeTruthy();
    });

    it('[LoadUserStatsSuccess] should set user stats and loading to false', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;
      const stats: UserStats = UserStatsMother.random();

      let state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStats()
      );
      state = fromReducer.userStatsReducer(
        state,
        LoadUserStatsSuccess({ stats })
      );

      expect(state.stats).toEqual(stats);
      expect(state.loading).toBeFalsy();
    });

    it('[LoadUserStatsFailed] should set loading to false without stats', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;

      let state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStats()
      );
      state = fromReducer.userStatsReducer(state, LoadUserStatsFailed());

      expect(state.loading).toBeFalsy();
      expect(state.stats).toBeNull();
    });
  });

  describe('LoadUserStatsByUserId', () => {
    it('[LoadUserStatsByUserId] should set loading true', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;
      const userId: UserId = UserIdMother.random();

      const state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStatsByUserId({ userId })
      );

      expect(state.loading).toBeTruthy();
    });

    it('[LoadUserStatsByUserIdSuccess] should set loading false and stats by userId', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;
      const userId: UserId = UserIdMother.random();
      const stats: UserStats = UserStatsMother.random();

      let state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStatsByUserId({ userId })
      );
      state = fromReducer.userStatsReducer(
        state,
        LoadUserStatsByUserIdSuccess({ stats })
      );

      expect(state.statsByUserId).toEqual(stats);
      expect(state.loading).toBeFalsy();
    });

    it('[LoadUserStatsByUserIdFailed] should set loading to false without stats', () => {
      const { INITIAL_USER_STATS_STATE } = fromReducer;
      const userId: UserId = UserIdMother.random();
      const stats: UserStats = UserStatsMother.random();

      let state = fromReducer.userStatsReducer(
        INITIAL_USER_STATS_STATE,
        LoadUserStatsByUserId({ userId })
      );
      state = fromReducer.userStatsReducer(
        state,
        LoadUserStatsByUserIdFailed()
      );

      expect(state.loading).toBeFalsy();
      expect(state.statsByUserId).toBeNull();
    });
  });
});
