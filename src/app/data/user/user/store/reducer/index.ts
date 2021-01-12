import { ActionReducerMap } from '@ngrx/store';
import { UserProfileState, userReducer } from './user.reducer';

export const KEY_FEATURE_STATE = 'user';

export interface UserState {
  profile: UserProfileState;
}

export const userState: ActionReducerMap<UserState> = {
  profile: userReducer,
};
