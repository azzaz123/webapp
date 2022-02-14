import { mapSubscriptions, subscriptionMapper } from './subscriptions-mapper';
import { MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS, MOCK_RESPONSE_V3_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { BUMP_PERKS } from '../subscriptions.interface';

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
        const oneDay = 1000 * 60 * 60 * 24;
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_V3_SUBSCRIPTIONS);

        subscriptionsMapped[0].tiers.forEach((tier) => {
          const nextDayAfterDiscountEndDate = tier.discount.end_date + oneDay;
          expect(tier.discount.no_discount_date).toEqual(nextDayAfterDiscountEndDate);
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

  describe('bumps', () => {
    describe('and has more than one bump type', () => {
      it('should map bumps', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS);

        subscriptionsMapped[0].tiers.forEach((tier) => {
          const expected = tier.perks.filter((bumps) => BUMP_PERKS.includes(bumps.name));
          expect(tier.bumps).toEqual(expected);
          expect(tier.bumps.length).toEqual(1);
        });
      });
    });
    describe('and has multiple bump type', () => {
      it('should map bumps', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS);

        subscriptionsMapped[1].tiers.forEach((tier) => {
          const expected = tier.perks.filter((bumps) => BUMP_PERKS.includes(bumps.name));
          expect(tier.bumps).toEqual(expected);
          expect(tier.bumps.length).toEqual(2);
        });
      });
    });
    describe('and has not bump type', () => {
      it('should not map bumps', () => {
        const subscriptionsMapped = mapSubscriptions(MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS);

        subscriptionsMapped[2].tiers.forEach((tier) => {
          expect(tier.bumps).toEqual([]);
        });
      });
    });
  });
});
