import { UserLocation } from '@data/user';
import { selectUserLocation } from 'app/data/user/store/selectors/location.selector';

import { UserLocationMother } from './../../domain/location/user-location.mother';

describe('Location Selector', () => {
  describe('selectUserLocation', () => {
    it('should receive location', () => {
      const location: UserLocation = UserLocationMother.random();

      const select = selectUserLocation.projector({ location });

      expect(select).toEqual(location);
    });
  });
});
