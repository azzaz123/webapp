import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

export interface SubscriptionSlot {
  subscription: SubscriptionsResponse;
  available: number;
  limit: number;
}
