import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';

export interface SubscriptionSlotGeneralResponse {
  slots: SubscriptionSlotResponse[];
}

export interface SubscriptionSlotResponse {
  type: SUBSCRIPTION_CATEGORY_TYPES;
  available: number;
  limit: number;
}
