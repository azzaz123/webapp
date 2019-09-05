export interface SubscriptionResponse {
  id: string;
  latest_invoice_id: string;
  payment_secret_key: string;
  payment_status: string;
  status: string;
  subscription_plan_id: string;
}

export interface Tier {
    id: number,
    limit: number,
    price: number,
    currency: string
}

export interface SubscriptionsResponse {
  category_id: number,
  current_limit: number,
  subscribed_from: number,
  selected_tier_id: number,
  default_tier_id: number,
  tiers: Tier[],
  category_name?: string,
  category_icon?: string
}