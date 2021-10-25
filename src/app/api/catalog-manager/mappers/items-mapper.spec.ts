import {
  MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_MAPPED,
  MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_RESPONSE,
} from '@fixtures/items-subscription-type.fixtures.spec';
import { mapItems } from './items-mapper';

describe('Items by subscription type', () => {
  describe('when mapping items by subscription type dto to item domain', () => {
    it('should map to item domain', () => {
      const mappedItems = mapItems(MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_RESPONSE);
      expect(mappedItems).toEqual(MOCK_ITEMS_BY_SUBSCRIPTION_TYPE_MAPPED);
    });
  });
});
