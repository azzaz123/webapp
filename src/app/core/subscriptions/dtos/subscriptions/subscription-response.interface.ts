import { Perks, TierDiscount } from '@core/subscriptions/subscriptions.interface';

export interface SubscriptionsV3Response {
  id?: string;
  category_ids: number[];
  current_limit?: number;
  subscribed_from?: number;
  selected_tier_id?: string;
  default_tier_id: string;
  trial_available: boolean;
  trial_days: number;
  tiers: TierDto[];
  selected_tier?: TierDto;
  subscribed_until?: number;
  market?: string;
  type: string;
}

export interface TierDto {
  id: string;
  price: number;
  currency: string;
  discount: TierDiscount;
  is_basic: boolean;
  limit: number;
  perks: Perks[];
}
