import { CategoryResponse } from '../category/category-response.interface';

export interface SubscriptionResponse {
  id: string;
  latest_invoice_id: string;
  payment_secret_key: string;
  payment_status: string;
  status: string;
  subscription_plan_id: string;
}

export interface Tier {
    id: string;
    limit: number;
    price: number;
    currency: string;
}

export interface SubscriptionsResponse {
  category_id: number;
  current_limit: number;
  subscribed_from: number;
  selected_tier_id: string;
  default_tier_id: string;
  tiers: Tier[];
  category_name?: string;
  category_icon?: string;
  selected_tier?: Tier;
  subscribed_until?: number;
}

export interface SubscriptionSlotResponse {
  category_id: number;
  available: number;
  limit: number;
}

export interface SubscriptionSlot {
  category: CategoryResponse;
  available: number;
  limit: number;
}
