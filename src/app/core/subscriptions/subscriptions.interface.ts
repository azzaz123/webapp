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
  discount: TierDiscount;
  is_basic: boolean;
  perks: Perks[];
  bumps: Bumps[];
}

export interface Perks {
  name: PERK_NAMES;
  quantity: number;
  used?: number;
  duration_days?: number;
}

export interface Bumps extends Perks {
  used: number;
  duration_days: number;
}

export interface TierDiscount {
  price: number;
  end_date: number;
  percentage: number;
  no_discount_date?: number;
}

export enum SUBSCRIPTION_MARKETS {
  STRIPE = 'STRIPE',
}

export type SUBSCRIPTION_CATEGORIES = 0 | 100 | 14000 | 12800;

export type SUBSCRIPTION_SOURCE = 'landing_banner' | 'landing_details';

export enum SUBSCRIPTION_CATEGORY_TYPES {
  CARS = 'CARS',
  MOTORBIKES = 'MOTORBIKES',
  CAR_PARTS = 'CARPARTS',
  REAL_ESTATE = 'REALESTATE',
  CONSUMER_GOODS = 'CONSUMERGOODS',
  OLD_CONSUMER_GOODS = 'OLD_CONSUMERGOODS',
}

export enum PERK_NAMES {
  ZONEBUMP = 'zonebump',
  CITYBUMP = 'citybump',
  COUNTRYBUMP = 'countrybump',
  LIMIT = 'limit',
}

export const BUMP_PERKS = [PERK_NAMES.CITYBUMP, PERK_NAMES.COUNTRYBUMP, PERK_NAMES.ZONEBUMP];
export interface SubscriptionsResponse {
  id?: string;
  category_id: number;
  current_limit?: number;
  subscribed_from?: number;
  selected_tier_id?: string;
  default_tier_id: string;
  trial_available: boolean;
  trial_days: number;
  tiers: Tier[];
  category_name?: string;
  category_icon?: string;
  selected_tier?: Tier;
  subscribed_until?: number;
  market?: SUBSCRIPTION_MARKETS;
  type: SUBSCRIPTION_CATEGORY_TYPES;
  category_ids: number[];
}
