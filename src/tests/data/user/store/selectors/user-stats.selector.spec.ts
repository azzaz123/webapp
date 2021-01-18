import { UserStats } from '@data/user';
import { BooleanMother } from '@fixtures/shared';
import { UserStatsState } from 'app/data/user/store/reducer/stats.reducer';
import {
  selectUserStats,
  selectUserStatsByUserId,
  selectUserStatsLoading,
} from 'app/data/user/store/selectors/stats.selector';
import { UserStatsMother } from './../../domain/stats/user-stats.mother';
import { UserStatsStateMother } from './../reducer/user-stats.state.mother';

describe('UserStatsSelector', () => {
  describe('selectUserStats', () => {
    it('should return stats of profile', () => {
      const stats: UserStats = UserStatsMother.random();
      const state: UserStatsState = UserStatsStateMother.random({ stats });

      const select = selectUserStats.projector(state);

      expect(select).toEqual(stats);
    });
  });

  describe('selectUserStatsByUserId', () => {
    it('should return stats by userId', () => {
      const stats: UserStats = UserStatsMother.random();
      const state: UserStatsState = UserStatsStateMother.random({
        statsByUserId: stats,
      });

      const select = selectUserStatsByUserId.projector(state);

      expect(select).toEqual(stats);
    });
  });

  describe('selectUserStatsLoading', () => {
    const loading: boolean = BooleanMother.random();
    const state: UserStatsState = UserStatsStateMother.random({ loading });

    const select = selectUserStatsLoading.projector(state);

    expect(select).toEqual(loading);
  });
});
