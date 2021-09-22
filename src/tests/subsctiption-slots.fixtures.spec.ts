import { SubscriptionSlotResponse, SubscriptionSlotGeneralResponse } from '@api/catalog-manager/dtos/slots/slots-response.interface';
import { SubscriptionSlot } from '@api/catalog-manager/interfaces/subscription-slot/subscription-slot.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { FREE_TRIAL_AVAILABLE_SUBSCRIPTION, MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED } from './subscriptions.fixtures.spec';

export const MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE: SubscriptionSlotResponse = {
  type: SUBSCRIPTION_CATEGORY_TYPES.CARS,
  available: 3,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE: SubscriptionSlotResponse = {
  type: SUBSCRIPTION_CATEGORY_TYPES.MOTORBIKES,
  available: 2,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE: SubscriptionSlotResponse = {
  type: SUBSCRIPTION_CATEGORY_TYPES.CAR_PARTS,
  available: 0,
  limit: 10,
};

export const MOCK_SUBSCRIPTION_SLOTS_RESPONSE: SubscriptionSlotResponse[] = [
  MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE,
];

export const MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE: SubscriptionSlotGeneralResponse = {
  slots: MOCK_SUBSCRIPTION_SLOTS_RESPONSE,
};

export const MOCK_SUBSCRIPTION_SLOT_CARS: SubscriptionSlot = {
  subscription: MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  available: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES: SubscriptionSlot = {
  subscription: FREE_TRIAL_AVAILABLE_SUBSCRIPTION,
  available: MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE.available,
  limit: MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE.limit,
};

export const MOCK_SUBSCRIPTION_SLOTS: SubscriptionSlot[] = [MOCK_SUBSCRIPTION_SLOT_CARS, MOCK_SUBSCRIPTION_SLOT_MOTORBIKES];
