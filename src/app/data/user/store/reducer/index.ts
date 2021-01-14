import { ActionReducerMap } from '@ngrx/store';
import { userLocationReducer, UserLocationState } from './location.reducer';
import { UserProfileState, userProfileReducer } from './profile.reducer';
import { userStatsReducer, UserStatsState } from './stats.reducer';

export const KEY_FEATURE_STATE = 'user';

export interface UserState {
  profile: UserProfileState;
  location: UserLocationState;
  stats: UserStatsState;
}

export const userState: ActionReducerMap<UserState> = {
  profile: userProfileReducer,
  location: userLocationReducer,
  stats: userStatsReducer,
};
