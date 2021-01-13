import { API_ACTION } from '@core/store';
import { createAction, props } from '@ngrx/store';
import { UserLocation } from '../domain';

export const KEY_STATE = '[User Location]';

export const UserLocationLoaded = createAction(
  `${KEY_STATE} ${API_ACTION} User Location Loaded`,
  props<{ location: UserLocation }>()
);
