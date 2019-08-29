export interface Subscription {
  id: string;
  latest_invoice_id: string;
  payment_secret_key: string;
  payment_status: string;
  status: string;
  subscription_plan_id: string;
}