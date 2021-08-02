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
  limit?: number;
  price: number;
  currency: string;
  discount?: TierDiscount;
}

export interface TierDiscount {
  price: number;
  end_date: number;
  percentage: number;
}

export enum SUBSCRIPTION_MARKETS {
  STRIPE = 'STRIPE',
  GOOGLE_PLAY = 'GOOGLE_PLAY',
  APPLE_STORE = 'APPLE_STORE',
}

export type SUBSCRIPTION_CATEGORIES = 0 | 100 | 14000 | 12800;

export type SUBSCRIPTION_SOURCE = 'landing_banner' | 'landing_details';

export interface SubscriptionsResponse {
  id?: string;
  category_id: number;
  current_limit?: number;
  subscribed_from?: number;
  selected_tier_id: string;
  default_tier_id: string;
  trial_available: boolean;
  trial_days: number;
  tiers: Tier[];
  category_name?: string;
  category_icon?: string;
  selected_tier?: Tier;
  subscribed_until?: number;
  market?: SUBSCRIPTION_MARKETS;
}

export interface SubscriptionSlotGeneralResponse {
  slots: SubscriptionSlotResponse[];
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
