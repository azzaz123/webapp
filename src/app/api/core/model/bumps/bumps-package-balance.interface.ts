import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { BUMP_TYPE } from './bump.interface';

export interface BumpsPackageBalance {
  subscription_type: SUBSCRIPTION_CATEGORY_TYPES;
  category_ids: number[];
  balance: BumpPackageBalance[];
}

export interface BumpPackageBalance {
  type: BUMP_TYPE;
  duration_days: number;
  total: number;
  used: number;
}
