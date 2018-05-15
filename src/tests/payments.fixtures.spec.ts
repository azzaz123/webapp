import {
  BillingInfoResponse, FinancialCard, SabadellInfoResponse, Packs, PackResponse, ProductResponse, OrderProExtras 
} from '../app/core/payments/payment.interface';
import { Pack } from '../app/core/payments/pack';

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

export const PACK_ID = '6b8ae6e1-0a71-412c-b1be-637ba654b91b';
export const NATIONAL_BUMP_ID = '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66';
export const BUMP_ID = 'dc29027d-274d-4c0c-bdb6-155130db000d';
export const LISTINGS_ID = '799a7381-0eae-4a47-a03b-b412ea0f7a2e';
export const SUBSCRIPTION_ID = '1';

export function createPacksFixture(): Packs {
  const PACKS: Packs = {
    cityBump: [],
    countryBump: []
  };
  const packCityBump = new Pack(
    '1',
    1,
    5.99,
    'EUR',
    'cityBump'
  );
  packCityBump.calculateDiscount('5.99', 1, 5.99);
  const packCityBumpSecond = new Pack(
    '2',
    5,
    15.99,
    'EUR',
    'cityBump'
  );
  packCityBumpSecond.calculateDiscount('15.99', 5, 5.99);
  const packCityBumpThird = new Pack(
    '3',
    15,
    25.99,
    'EUR',
    'cityBump'
  );
  packCityBumpThird.calculateDiscount('25.99', 15, 5.99);
  PACKS.cityBump.push(packCityBump);
  PACKS.cityBump.push(packCityBumpSecond);
  PACKS.cityBump.push(packCityBumpThird);
  const packNationalBump = new Pack(
    '4',
    1,
    8.99,
    'EUR',
    'countryBump'
  );
  packNationalBump.calculateDiscount('8.99', 1, 8.99);
  const packNationalBumpSecond = new Pack(
    '5',
    5,
    18.99,
    'EUR',
    'countryBump'
  );
  packNationalBumpSecond.calculateDiscount('18.99', 5, 8.99);
  const packNationalBumpThird = new Pack(
    '6',
    15,
    28.99,
    'EUR',
    'countryBump'
  );
  packNationalBumpThird.calculateDiscount('28.99', 15, 8.99);
  PACKS.countryBump.push(packNationalBump);
  PACKS.countryBump.push(packNationalBumpSecond);
  PACKS.countryBump.push(packNationalBumpThird);

  return PACKS;
}

export const PACK_RESPONSE: PackResponse[] = [{
  'id': '1',
  'benefits': {[BUMP_ID]: 1},
  'price': '5.99',
  'currency': 'EUR'
}, {
  'id': '2',
  'benefits': {[BUMP_ID]: 5},
  'price': '15.99',
  'currency': 'EUR'
}, {
  'id': '3',
  'benefits': {[BUMP_ID]: 15},
  'price': '25.99',
  'currency': 'EUR'
}, {
  'id': '4',
  'benefits': {[NATIONAL_BUMP_ID]: 1},
  'price': '8.99',
  'currency': 'EUR'
}, {
  'id': '5',
  'benefits': {[NATIONAL_BUMP_ID]: 5},
  'price': '18.99',
  'currency': 'EUR'
}, {
  'id': '6',
  'benefits': {[NATIONAL_BUMP_ID]: 15},
  'price': '28.99',
  'currency': 'EUR'
}];

export const PRODUCTS_RESPONSE_PACKS: ProductResponse[] = [{
  id: NATIONAL_BUMP_ID,
  name: 'NATIONAL_BUMP'
}, {
  id: BUMP_ID,
  name: 'BUMP'
}];

export const PREPARED_PACKS: Array<any> = [
  {
    quantity: 1,
    packs: [(this.createPacksFixture()).cityBump[0], (this.createPacksFixture()).countryBump[0]]
  },
  {
    quantity: 5,
    packs: [(this.createPacksFixture()).cityBump[1], (this.createPacksFixture()).countryBump[1]]
  },
  {
    quantity: 15,
    packs: [(this.createPacksFixture()).cityBump[2], (this.createPacksFixture()).countryBump[2]]
  }
];

export const ORDER_CART_EXTRAS_PRO: OrderProExtras = {
  id: 'UUID',
  packs: ['1', '5']
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
