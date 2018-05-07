export interface FinancialCard {
  expire_date: number;
  id: string;
  number: string;
}

export interface SabadellInfoResponse {
  merchant_parameters: string;
  signature: string;
  signature_version: string;
  target_url: string;
}

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