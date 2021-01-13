import { UserLocationLoaded } from './../../../../../app/data/user/actions/location.action';
import { UserLocation } from '@core/user/user-response.interface';
import { Action } from '@ngrx/store';
import * as fromReducer from 'app/data/user/store/reducer/location.reducer';
import { UserLocationMother } from './../../domain';

describe('Location Reducer', () => {
  describe('Initial State', () => {
    it('should return an initial state', () => {
      const { INITIAL_USER_LOCATION_STATE } = fromReducer;

      const action: Action = {
        type: 'unkown',
      };

      const state = fromReducer.locationReducer(
        INITIAL_USER_LOCATION_STATE,
        action
      );

      expect(state).toEqual(INITIAL_USER_LOCATION_STATE);
    });
  });

  describe('User Location loaded', () => {
    it('should set user location in store', () => {
      const { INITIAL_USER_LOCATION_STATE } = fromReducer;
      const location: UserLocation = UserLocationMother.random();

      const state = fromReducer.locationReducer(
        INITIAL_USER_LOCATION_STATE,
        UserLocationLoaded({ location })
      );

      expect(state).toEqual({ location });
    });
  });
});
