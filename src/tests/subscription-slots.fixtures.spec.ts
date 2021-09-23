import { SubscriptionSlotResponse, SubscriptionSlotGeneralResponse } from '@api/catalog-manager/dtos/slots/slots-response.interface';
import { SubscriptionSlot } from '@api/catalog-manager/interfaces/subscription-slot/subscription-slot.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED } from './subscriptions.fixtures.spec';

export const MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE: SubscriptionSlotResponse = {
  type: SUBSCRIPTION_CATEGORY_TYPES.CARS,
  available: 3,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE_RESPONSE: SubscriptionSlotResponse = {
  type: SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE,
  available: 2,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOTS_RESPONSE: SubscriptionSlotResponse[] = [
  MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE_RESPONSE,
];

export const MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE: SubscriptionSlotGeneralResponse = {
  slots: MOCK_SUBSCRIPTION_SLOTS_RESPONSE,
};

export const MOCK_SUBSCRIPTION_SLOT_CARS: SubscriptionSlot = {
  subscription: MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  available: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE: SubscriptionSlot = {
  subscription: MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
  available: MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOTS: SubscriptionSlot[] = [MOCK_SUBSCRIPTION_SLOT_CARS, MOCK_SUBSCRIPTION_SLOT_REAL_ESTATE];
