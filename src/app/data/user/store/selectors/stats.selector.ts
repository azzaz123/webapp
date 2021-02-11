import { UserStatsState } from './../reducer/stats.reducer';
import { UserState } from './../reducer/index';
import { selectUserFeature } from './user.selector';
import { createSelector } from '@ngrx/store';

const selectUserStatsState = createSelector(selectUserFeature, (userState: UserState) => userState.stats);

export const selectUserStats = createSelector(selectUserStatsState, (userStatsState: UserStatsState) => userStatsState.stats);

export const selectUserStatsByUserId = createSelector(
  selectUserStatsState,
  (userStatsState: UserStatsState) => userStatsState.statsByUserId
);

export const selectUserStatsLoading = createSelector(selectUserStatsState, (userStatsState: UserStatsState) => userStatsState.loading);
