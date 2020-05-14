import { Pack } from './pack';
import { IOption } from 'ng-select/option.interface';
export interface PerkResponse {
  expire_date: number;
  create_date: number;
  perk_id: string;
  product_id: string;
  quantity: number;
  subscription_id?: string;
  total?: number;
}

export interface Perks {
  subscription: Perk;
  extra: Perk;
}

export interface Perk {
  bump: {
    quantity: number,
    total?: number,
    createDate?: number
  };
  national: {
    quantity: number,
    total?: number,
    createDate?: number
  };
  listing?: {
    quantity: number,
    total?: number,
    createDate?: number
  };
}

export interface CartPacks {
  bumps: Pack;
  nationals: Pack;
}

export interface Packs {
  [key: string]: Pack[];
}

export interface PackResponse {
  id: string;
  benefits: {
    [key: string]: number;
  };
  price: string;
  original_price?: string;
  currency: string;
}

export interface ProductResponse {
  id: string;
  name: 'NATIONAL_BUMP' | 'BUMP' | 'LISTINGS' | 'WALLACOINS' | 'WALLACREDITS';
}

export interface Products {
  [key: string]: ProductResponse;
}

export interface OrderProExtras {
  packs: Array<string>;
  id: string;
  origin?: string;
  provider?: string;
}

export interface BillingInfoResponse {
  cif: string;
  city: string;
  company_name: string;
  country: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  postal_code: string;
  street: string;
  surname: string;
  type: string;
}

export interface FinancialCard {
  expire_date: number | string;
  id: string;
  number: string;
  favorite?: boolean;
  stripeCard?: StripeCard;
}

export interface FinancialCardOption extends IOption {
  expire_date: string;
  id: string;
  number: string;
  favorite?: boolean;
  stripeCard?: StripeCard;
}

export interface CardCheck {
  address_line1_check: string;
  address_postal_code_check: string;
  cvc_check: string;
}

export interface StripeCard {
  brand: string;
  checks: CardCheck;
  country: string;
  exp_month: number;
  exp_year: number;
  funding: string;
  generated_from: number;
  last4: string;
  three_d_secure_usage: { supported : boolean };
  wallet: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: number;
  state: string;
}

export interface BillingDetails {
  address: Address;
  email: string;
  name: string;
  phone: number;
}

export interface PaymentMethodResponse {
  billing_details: BillingDetails;
  card: StripeCard;
  created: number;
  customer: string;
  id: string;
  livemode: boolean;
  metadata: any;
  object: string;
  type: string;
}

export interface PaymentMethodCardResponse {
  brand: string;
  default: boolean;
  expiration_month: number;
  expiration_year: number;
  id: string;
  last_digits: string;
}

export interface Order {
  id: string;
  packs: string[];
}

export interface ScheduledStatus {
  active: boolean;
  autorenew_alert: number;
  autorenew_scheduled: ScheduledBumps;
  purchased?: ScheduledBumps;
  items_scheduled_purchases?: ScheduledBumps;
}

export interface ScheduledBumps {
  citybump?: number;
  zonebump?: number;
  countrybump?: number;
  urgent?: number;
}

export interface CreditInfo {
  currencyName: string;
  credit: number;
  factor: number;
}

export interface PaymentIntents {
  token: string;
  status?: string;
}
