import { Action, createReducer, on } from '@ngrx/store';
import { SetUserLocation } from '../../actions';
import { UserLocation } from '../../domain';

export interface UserLocationState {
  location: UserLocation;
}

export const INITIAL_USER_LOCATION_STATE: UserLocationState = {
  location: null,
};

const reducer = createReducer(
  INITIAL_USER_LOCATION_STATE,
  on(SetUserLocation, (state, { location }) => ({ location }))
);

export function locationReducer(
  state: UserLocationState | undefined,
  action: Action
): UserLocationState {
  return reducer(state, action);
}
