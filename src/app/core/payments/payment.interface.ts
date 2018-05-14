import { Pack } from './pack';

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

export interface Packs {
  [key: string]: Pack[];
}

export interface PackResponse {
  id: string;
  benefits: {
    [key: string]: number;
  };
  price: string;
  currency: string;
}

export interface ProductResponse {
  id: string;
  name: 'NATIONAL_BUMP' | 'BUMP';
}

export interface Products {
  [key: string]: ProductResponse;
}

export interface OrderProExtras {
  packs: Array<string>;
  id: string;
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
