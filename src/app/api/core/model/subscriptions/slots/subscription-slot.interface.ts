import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { BumpPackageBalance } from '../../bumps/bumps-package-balance.interface';

export interface SubscriptionSlot {
  subscription: SubscriptionsResponse;
  available: number;
  limit: number;
  bumpBalance: BumpPackageBalance[];
}
