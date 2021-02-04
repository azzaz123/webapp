import { UserId } from './../domain/profile/user-id';
import { UserStats } from './../domain/stats/user-stats';
import { API_ACTION, PAGE_ACTION } from '@core/store';
import { createAction, props } from '@ngrx/store';
const KEY_STATE = '[User Stats]';

export const LoadUserStats = createAction(`${KEY_STATE} ${PAGE_ACTION} Load User Stats`);

export const LoadUserStatsSuccess = createAction(`${KEY_STATE} ${API_ACTION} Load User Stats Success`, props<{ stats: UserStats }>());

export const LoadUserStatsFailed = createAction(`${KEY_STATE} ${API_ACTION} Load User Stats Failed`);

export const LoadUserStatsByUserId = createAction(`${KEY_STATE} ${PAGE_ACTION} Load User Stats By User Id`, props<{ userId: UserId }>());

export const LoadUserStatsByUserIdSuccess = createAction(
  `${KEY_STATE} ${API_ACTION} Load User Stats By User Id Success`,
  props<{ stats: UserStats }>()
);

export const LoadUserStatsByUserIdFailed = createAction(`${KEY_STATE} ${API_ACTION} Load User Stats By User Id Failed`);
