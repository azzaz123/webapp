import { createSelector } from '@ngrx/store';
import { Profile } from '../../domain';
import { UserState } from '../reducer';

import { UserProfileState } from '../reducer/profile.reducer';
import { selectUserFeature } from './user.selector';

const selectUserProfileState = createSelector(
  selectUserFeature,
  (userState: UserState) => userState.profile
);

export const selectUserProfileDetail = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => userProfileState.userDetail
);

export const selectUserProfileDetailId = createSelector(
  selectUserProfileDetail,
  (profile: Profile) => profile?.id
);

export const selectUserProfileLoading = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => userProfileState.loading
);

export const selectUserProfileIsAuthenticated = createSelector(
  selectUserProfileState,
  (userProfileState: UserProfileState) => !!userProfileState.userDetail
);
