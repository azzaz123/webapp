import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KEY_FEATURE_STATE, UserState } from '../reducer';
import { UserProfileState } from './../reducer/user.reducer';

const selectUserProfileFeature = createFeatureSelector<UserState>(
  KEY_FEATURE_STATE
);

const selectUserProfileState = createSelector(
  selectUserProfileFeature,
  (userState: UserState) => userState.profile
);

export const selectUserProfileDetail = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => userProfileState.userDetail
);

export const selectUserProfileLoading = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => userProfileState.loading
);

export const selectUserProfileIsAuthenticated = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => userProfileState.isAuthenticated
);
