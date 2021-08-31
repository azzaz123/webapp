import { mapSubscriptions } from './subscriptions-mapper';
import { MOCK_RESPONSE_V3_SUBSCRIPTIONS, MOCK_V3_MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';

describe('SubscriptionsMapper', () => {
  describe('getSubscriptions', () => {
    it('should return the json from the categories and convert it into options', () => {
      const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

      expect(subscriptionsMapped).toEqual(MOCK_V3_MAPPED_SUBSCRIPTIONS);
    });
  });

  it('should map discounts', () => {
    const nextDayAfterDiscountEndDate = 1000 * 60 * 60 * 24;

    const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

    subscriptionsMapped[4].tiers.forEach((tier) => {
      expect(tier.discount.no_discount_date).toEqual(tier.discount.end_date + nextDayAfterDiscountEndDate);
    });
  });
});
