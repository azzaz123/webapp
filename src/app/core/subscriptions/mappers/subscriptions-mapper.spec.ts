import { mapSubscriptions, subscriptionMapper } from './subscriptions-mapper';
import { MOCK_RESPONSE_V3_SUBSCRIPTIONS, MOCK_V3_MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { SUBSCRIPTION_CATEGORY_TYPES } from '../subscriptions.interface';

describe('SubscriptionsMapper', () => {
  describe('getSubscriptions', () => {
    it('should return subscriptions with category data', () => {
      const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

      subscriptionsMapped.forEach((subscription) => {
        expect(subscription.category_id).toEqual(subscriptionMapper[subscription.type].category_id);
        expect(subscription.category_name).toEqual(subscriptionMapper[subscription.type].label);
        expect(subscription.category_icon).toEqual(subscriptionMapper[subscription.type].icon_id);
      });
    });
  });

  describe('discounts', () => {
    describe('and has discounts', () => {
      it('should map discounts', () => {
        const nextDayAfterDiscountEndDate = 1000 * 60 * 60 * 24;
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

        subscriptionsMapped[0].tiers.forEach((tier) => {
          expect(tier.discount.no_discount_date).toEqual(tier.discount.end_date + nextDayAfterDiscountEndDate);
        });
      });
    });
    describe('and has not discounts', () => {
      it('should not map discounts', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

        subscriptionsMapped[1].tiers.forEach((tier) => {
          expect(tier.discount).toBeFalsy();
        });
      });
    });
  });

  describe('Default tier', () => {
    describe('and has selected tier id', () => {
      it('shuld set selected tier', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);
        const expectedTier = subscriptionsMapped[0].tiers.find((tier) => tier.id === subscriptionsMapped[0].selected_tier_id);

        expect(subscriptionsMapped[0].selected_tier).toEqual(expectedTier);
      });
    });
    describe('and has not selected tier id', () => {
      it('shuld set selected tier using default tier', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

        expect(subscriptionsMapped[1].selected_tier).toBeFalsy();
      });
    });
  });
});
