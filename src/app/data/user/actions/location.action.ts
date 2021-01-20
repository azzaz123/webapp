import { Coordinate } from '@core/geolocation/address-response.interface';
import { API_ACTION, PAGE_ACTION } from '@core/store';
import { createAction, props } from '@ngrx/store';
import { UserLocation } from '../domain';

export const KEY_STATE = '[User Location]';

export const SetUserLocation = createAction(
  `${KEY_STATE} ${API_ACTION} Set User Location`,
  props<{ location: UserLocation }>()
);

export const UpdateUserLocation = createAction(
  `${KEY_STATE} ${PAGE_ACTION} Update User Location`,
  props<{ coordinate: Coordinate }>()
);

export const UpdateUserLocationSuccess = createAction(
  `${KEY_STATE} ${API_ACTION} Update User Location Success`,
  props<{ location: UserLocation }>()
);

export const UpdateUserLocationFailed = createAction(
  `${KEY_STATE} ${API_ACTION} Update User Location Failed`
);
