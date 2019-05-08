import { Pack } from './pack';
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
}

export interface FinancialCard {
  expire_date: number;
  id: string;
  number: string;
}

export interface Order {
  id: string;
  packs: string[];
}

export interface SabadellInfoResponse {
  merchant_parameters: string;
  signature: string;
  signature_version: string;
  target_url: string;
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
}
