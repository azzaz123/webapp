import { Action, createReducer, on } from '@ngrx/store';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
  SendUpdateEmail,
  SendUpdateEmailFailed,
  SendUpdatePassword,
  SendUpdatePasswordFailed,
} from '../../actions/user.action';
import { Profile } from '../../domain';

export interface UserProfileState {
  userDetail: Profile | null;
  loading: boolean;
}

export const INITIAL_USER_PROFILE_STATE: UserProfileState = {
  userDetail: null,
  loading: false,
};

const reducer = createReducer(
  INITIAL_USER_PROFILE_STATE,
  on(LoadUserProfile, SendUpdateEmail, SendUpdatePassword, (state) => ({
    ...state,
    loading: true,
  })),
  on(LoadUserProfileSuccess, (state, { user }) => ({
    ...state,
    userDetail: user,
    loading: false,
  })),
  on(LoadUserProfileFailed, () => ({ ...INITIAL_USER_PROFILE_STATE })),
  on(SendUpdateEmailFailed, SendUpdatePasswordFailed, (state) => ({
    ...state,
    loading: false,
  }))
);

export function userProfileReducer(state: UserProfileState | undefined, action: Action): UserProfileState {
  return reducer(state, action);
}
