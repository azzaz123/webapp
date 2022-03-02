import { getRadiusInKm } from './map.constants';
describe('getRadiusInKm', () => {
  describe('when getting the radius in km from a latitude and a zoom level', () => {
    it('should return the corresponding radius distance in km', () => {
      const MOCK_ZOOM_LEVEL: number = 18;
      const MOCK_LOCATION_LATITUDE: number = -3.70379;
      let result: number;

      result = getRadiusInKm(MOCK_ZOOM_LEVEL, MOCK_LOCATION_LATITUDE);

      expect(result).toEqual(1);
    });
  });
});
