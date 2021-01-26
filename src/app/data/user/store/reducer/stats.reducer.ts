import { createReducer, on, Action } from '@ngrx/store';
import {
  LoadUserStatsByUserId,
  LoadUserStats,
  LoadUserStatsSuccess,
  LoadUserStatsByUserIdSuccess,
  LoadUserStatsFailed,
  LoadUserStatsByUserIdFailed,
} from '../../actions';
import { UserStats } from './../../domain/stats/user-stats';

export interface UserStatsState {
  stats: UserStats;
  statsByUserId: UserStats;
  loading: boolean;
}

export const INITIAL_USER_STATS_STATE: UserStatsState = {
  stats: null,
  statsByUserId: null,
  loading: false,
};

const reducer = createReducer(
  INITIAL_USER_STATS_STATE,
  on(LoadUserStats, LoadUserStatsByUserId, (state) => ({
    ...state,
    loading: true,
  })),
  on(LoadUserStatsSuccess, (state, { stats }) => ({ ...state, stats })),
  on(LoadUserStatsByUserIdSuccess, (state, { stats }) => ({
    ...state,
    statsByUserId: stats,
  })),
  on(
    LoadUserStatsSuccess,
    LoadUserStatsByUserIdSuccess,
    LoadUserStatsFailed,
    LoadUserStatsByUserIdFailed,
    (state) => ({ ...state, loading: false })
  )
);

export function userStatsReducer(
  state: UserStatsState,
  action: Action
): UserStatsState {
  return reducer(state, action);
}
