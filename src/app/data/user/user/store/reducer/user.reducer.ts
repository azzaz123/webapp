import { Action, createReducer, on } from '@ngrx/store';

import {
  LoadUserProfile,
  LoadUserProfileFailed,
  LoadUserProfileSuccess,
} from '../../actions/user.action';
import { User } from '../../domain/user';

export interface UserState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const INITIAL_STATE: UserState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

const reducer = createReducer(
  INITIAL_STATE,
  on(LoadUserProfile, (state) => ({ ...state, loading: true })),
  on(LoadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    isAuthenticated: true,
  })),
  on(LoadUserProfileFailed, () => ({ ...INITIAL_STATE }))
);

export function userReducer(
  state: UserState | undefined,
  action: Action
): UserState {
  return reducer(state, action);
}
