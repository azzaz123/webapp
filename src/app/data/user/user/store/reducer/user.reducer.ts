import { Action, createReducer, on } from '@ngrx/store';
import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
  SendUpdateEmailFailed,
  SendUpdatePasswordFailed,
} from '../../actions/user.action';
import { User } from '../../domain/user';
import {
  SendUpdateEmail,
  SendUpdatePassword,
} from './../../actions/user.action';

export interface UserProfileState {
  userDetail: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const INITIAL_STATE: UserProfileState = {
  userDetail: null,
  loading: false,
  isAuthenticated: false,
};

const reducer = createReducer(
  INITIAL_STATE,
  on(LoadUserProfile, SendUpdateEmail, SendUpdatePassword, (state) => ({
    ...state,
    loading: true,
  })),
  on(LoadUserProfileSuccess, (state, { user }) => ({
    ...state,
    userDetail: user,
    loading: false,
    isAuthenticated: true,
  })),
  on(LoadUserProfileFailed, () => ({ ...INITIAL_STATE })),
  on(SendUpdateEmailFailed, SendUpdatePasswordFailed, (state) => ({
    ...state,
    loading: false,
  }))
);

export function userReducer(
  state: UserProfileState | undefined,
  action: Action
): UserProfileState {
  return reducer(state, action);
}
