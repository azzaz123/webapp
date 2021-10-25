import { WALL_SORT_BY } from '../dtos';
import { mapOrderParameter } from './order-parameter-mapper';
import { SORT_BY } from '@api/core/model';

describe('OrderParameterMapper', () => {
  describe('when mapping from wall order to domain order', () => {
    it('should map to item card domain', () => {
      const mappedOrderParameter = mapOrderParameter(WALL_SORT_BY.DISTANCE);
      expect(mappedOrderParameter).toEqual(SORT_BY.DISTANCE);
    });
  });
});
