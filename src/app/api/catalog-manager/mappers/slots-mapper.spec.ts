import { mapSlotsResponseToSlots } from './slots-mapper';
import { MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_SUBSCRIPTION_SLOTS, MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE } from '@fixtures/subscription-slots.fixtures.spec';

describe('Subscription slots mapper', () => {
  describe('when mapping from subscription slots dto to subscription slot domain', () => {
    it('should map to subscription slot domain', () => {
      const mappedSlots = mapSlotsResponseToSlots(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE, [
        MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
        MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
      ]);
      expect(mappedSlots).toEqual(MOCK_SUBSCRIPTION_SLOTS);
    });
  });
});
