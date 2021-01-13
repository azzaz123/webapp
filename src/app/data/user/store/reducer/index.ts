import { ActionReducerMap } from '@ngrx/store';
import { locationReducer, UserLocationState } from './location.reducer';
import { UserProfileState, userReducer } from './profile.reducer';

export const KEY_FEATURE_STATE = 'user';

export interface UserState {
  profile: UserProfileState;
  location: UserLocationState;
}

export const userState: ActionReducerMap<UserState> = {
  profile: userReducer,
  location: locationReducer,
};
