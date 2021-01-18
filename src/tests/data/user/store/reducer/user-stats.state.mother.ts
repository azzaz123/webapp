import { BooleanMother } from '@fixtures/shared';
import { UserStatsState } from 'app/data/user/store/reducer/stats.reducer';
import { UserStatsMother } from './../../domain/stats/user-stats.mother';

export class UserStatsStateMother {
  static random(partial: Partial<UserStatsState>): UserStatsState {
    return {
      stats: UserStatsMother.random(partial.stats),
      statsByUserId: UserStatsMother.random(partial.statsByUserId),
      loading: BooleanMother.random(),
      ...partial,
    };
  }
}
