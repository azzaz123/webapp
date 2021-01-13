import { createSelector } from '@ngrx/store';
import { UserState } from './../reducer/index';
import { UserLocationState } from './../reducer/location.reducer';
import { selectUserFeature } from './user.selector';

const selectUserLocationState = createSelector(
  selectUserFeature,
  (userState: UserState) => userState.location
);

export const selectUserLocation = createSelector(
  selectUserLocationState,
  (location: UserLocationState) => location.location
);
