export interface ProductResponse {
  id: string;
  name: 'BOOST' | 'HIGHLIGHT' | 'BUMP' | 'LISTINGS' | 'CALL_TRACKING' | 'MULTI_PUBLICATOR' | 'LEAD_QUALIFICATION' | 'MULTI_ACCOUNT' |
    'NATIONAL_BUMP' | 'BUMP';
}

export interface Products {
  [key: string]: ProductResponse;
}

export interface PerkResponse {
  expire_date: number;
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
    total?: number,
    quantity: number
  };
  national: {
    total?: number,
    quantity: number
  };
  listing?: {
    total?: number,
    quantity: number
  };
}

export interface PackResponse {
  id: string;
  benefits: {
    [key: string]: number;
  };
  price: string;
  currency: string;
}

export interface Pack {
  id: string;
  quantity: number;
  price: number;
  currency: string;
  discount: number;
}

export interface Packs {
  bumps: Pack[];
  nationals: Pack[];
}

export interface CartPacks {
  bumps: Pack;
  nationals: Pack;
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
