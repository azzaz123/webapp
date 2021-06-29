import { mappedShippingRulesFixture, shippingRulesResponseFixture } from '@api/fixtures/bff/delivery/rules/shipping-rules.fixtures';
import { mapShippingRulesResponseToShippingRules } from './shipping-rules-mapper';

describe('ShippingRulesMapper', () => {
  describe('when mapping shipping rules response to shipping rules domain', () => {
    it('should map to shipping rules domain', () => {
      const shippingRulesMapped = mapShippingRulesResponseToShippingRules(shippingRulesResponseFixture);
      expect(shippingRulesMapped).toEqual(mappedShippingRulesFixture);
    });
  });
});
