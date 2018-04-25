import {
  BillingInfoResponse, FinancialCard, PackResponse, ProductResponse,
  SabadellInfoResponse
} from '../app/core/payments/payment.interface';
import { PacksModel } from '../app/core/payments/payment.model';

export const FINANCIAL_CARD: FinancialCard = {
  expire_date: 61598188800000,
  id: '06553101-a47d-45cb-b4e0-6f9d8e89014b',
  number: '1234***********1111'
};

export const SABADELL_RESPONSE: SabadellInfoResponse = {
  merchant_parameters: 'eyJEU19NRVJDSEFOVF9BTU9VTlQi',
  signature: '/XvjPsRtYubYTmKLCGkpA6XxOXj/rJ3sdGZl0+gz3lw=',
  signature_version: 'HMAC_SHA256_V1',
  target_url: 'https://sis-t.redsys.es:25443/sis/realizarPago'
};

export const BILLING_INFO_RESPONSE: BillingInfoResponse = {
  cif: 'cif',
  city: 'city',
  company_name: 'company',
  country: 'country',
  email: 'email@email.com',
  name: 'name',
  phone: '666666666',
  postal_code: '12345',
  street: 'street',
  surname: 'surname',
  id: '123'
};

export const NATIONAL_BUMP_ID: string = '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66';
export const BUMP_ID: string = 'dc29027d-274d-4c0c-bdb6-155130db000d';
export const LISTINGS_ID: string = '799a7381-0eae-4a47-a03b-b412ea0f7a2e';

export const PACK_RESPONSE: PackResponse[] = [{
  'id': '1',
  'benefits': {[BUMP_ID]: 1},
  'price': '5.99',
  'currency': 'EUR'
}, {
  'id': '2',
  'benefits': {[BUMP_ID]: 10},
  'price': '50.90',
  'currency': 'EUR'
}, {
  'id': '3',
  'benefits': {[BUMP_ID]: 50},
  'price': '179.70',
  'currency': 'EUR'
}, {
  'id': '4',
  'benefits': {[NATIONAL_BUMP_ID]: 1},
  'price': '3.99',
  'currency': 'EUR'
}, {
  'id': '5',
  'benefits': {[NATIONAL_BUMP_ID]: 10},
  'price': '33.90',
  'currency': 'EUR'
}, {
  'id': '6',
  'benefits': {[NATIONAL_BUMP_ID]: 50},
  'price': '119.70',
  'currency': 'EUR'
}];

export function createPacksModelFixture(): PacksModel {
  let PACKS_MODEL: PacksModel = new PacksModel();
  PACKS_MODEL.bumps = [{
    id: '1',
    quantity: 1,
    price: 5.99,
    currency: 'EUR',
    discount: 0
  }, {
    id: '2',
    quantity: 10,
    price: 50.9,
    currency: 'EUR',
    discount: 15
  }, {
    id: '3',
    quantity: 50,
    price: 179.7,
    currency: 'EUR',
    discount: 40
  }];

  PACKS_MODEL.nationals = [{
    id: '4',
    quantity: 1,
    price: 3.99,
    currency: 'EUR',
    discount: 0
  }, {
    id: '5',
    quantity: 10,
    price: 33.90,
    currency: 'EUR',
    discount: 15
  }, {
    id: '6',
    quantity: 50,
    price: 119.70,
    currency: 'EUR',
    discount: 40
  }];

  return PACKS_MODEL;

}

export const BUMPS_PRODUCT_RESPONSE: ProductResponse[] = [{
  id: NATIONAL_BUMP_ID,
  name: 'NATIONAL_BUMP'
}, {
  id: BUMP_ID,
  name: 'BUMP'
}, {
  id: LISTINGS_ID,
  name: 'LISTINGS'
}];
