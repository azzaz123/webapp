import { PurchasingItem, Purchase, AutorenewItem } from '../app/core/payments/purchase.interface';
import { PerksModel } from '../app/core/payments/payment.model';
import { getMockItem } from './item.fixtures.spec';
import { Pack } from '../app/core/payments/pack';
import {
  BillingInfoResponse,
  FinancialCard,
  SabadellInfoResponse,
  Packs,
  PackResponse,
  ProductResponse,
  OrderProExtras,
  PerkResponse
} from '../app/core/payments/payment.interface';
import { PurchasesModel } from '../app/core/payments/purchase.model';

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

export const PURCHASES_RESPONSE: Purchase[] = [{
  'item_id': '1',
  'expiration_date': 1495696668000,
  'boost': true,
  'highlight': true,
  'national': true,
  'bump': false,
  'autorenew': false,
  'visibility_flags': {'bumped': true, 'highlighted': false, 'urgent': false}
}, {
  'item_id': '2',
  'expiration_date': 1496215651120,
  'boost': true,
  'highlight': false,
  'national': false,
  'bump': true,
  'autorenew': true,
  'visibility_flags': {'bumped': true, 'highlighted': false, 'urgent': false}
}, {
  'item_id': '3',
  'expiration_date': 1495870049678,
  'boost': false,
  'highlight': true,
  'national': true,
  'bump': false,
  'autorenew': true,
  'visibility_flags': {'bumped': true, 'highlighted': false, 'urgent': false}
}];

export const PURCHASES: Purchase[] = <Purchase[]>[{
  ...PURCHASES_RESPONSE[0],
  item: getMockItem('1', 1)
}, {
  ...PURCHASES_RESPONSE[1],
  item: getMockItem('2', 2)
}, {
  ...PURCHASES_RESPONSE[2],
  item: getMockItem('3', 3)
}];

export const PURCHASES_MODEL: PurchasesModel = {
  bumpItems: PURCHASES_RESPONSE,
  nationalBumpItems: PURCHASES_RESPONSE
};

export const AUTORENEW_DATA: AutorenewItem[] = [{
  item_id: '1',
  autorenew: false
}, {
  item_id: '2',
  autorenew: true
}, {
  item_id: '3',
  autorenew: true
}];

export const PURCHASING_ITEMS: PurchasingItem[] = [
  {
    item_id: '1',
    autorenew: false,
    bump: true,
    national: true,
    boost: false,
    highlight: false
  },
  {
    item_id: '2',
    autorenew: true,
    bump: false,
    national: true,
    boost: false,
    highlight: false
  },
  {
    item_id: '3',
    autorenew: false,
    bump: true,
    national: false,
    boost: false,
    highlight: false
  },
  {
    item_id: '4',
    autorenew: true,
    bump: true,
    national: true,
    boost: false,
    highlight: false
  }
];

export const PACK_ID = '6b8ae6e1-0a71-412c-b1be-637ba654b91b';
export const NATIONAL_BUMP_ID = '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66';
export const BUMP_ID = 'dc29027d-274d-4c0c-bdb6-155130db000d';
export const LISTINGS_ID = '799a7381-0eae-4a47-a03b-b412ea0f7a2e';
export const SUBSCRIPTION_ID = '1';
export const BUMP_QUANTITY = 0;
export const NATIONAL_QUANTITY = 0;
export const LISTINGS_QUANTITY = 0;

export function createPacksFixture(): Packs {
  const PACKS: Packs = {
    cityBump: [],
    countryBump: [],
    listings: []
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
  packs: ['1', '2', '4', '5']
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

export const PERK_RESPONSE: PerkResponse[] = [{
  expire_date: 21342344,
  perk_id: '123',
  product_id: NATIONAL_BUMP_ID,
  quantity: NATIONAL_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  expire_date: 21342344,
  perk_id: '1234',
  product_id: BUMP_ID,
  quantity: BUMP_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  expire_date: 21342344,
  perk_id: '1234',
  product_id: LISTINGS_ID,
  quantity: LISTINGS_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  expire_date: 21342344,
  perk_id: '123',
  product_id: NATIONAL_BUMP_ID,
  quantity: NATIONAL_QUANTITY,
  subscription_id: null,
  total: 0
}, {
  expire_date: 21342344,
  perk_id: '1234',
  product_id: BUMP_ID,
  quantity: BUMP_QUANTITY,
  subscription_id: null,
  total: 0
}];

export function createPerksModelFixture(): PerksModel {

  let model = new PerksModel();
  PERK_RESPONSE.map((perk: PerkResponse) => {
    if (perk.product_id === NATIONAL_BUMP_ID) {
      if (perk.subscription_id !== null) {
        model.setNationalSubscription(perk);
      } else {
        model.setNationalExtra(perk);
      }
    } else if (perk.product_id === BUMP_ID) {
      if (perk.subscription_id !== null) {
        model.setBumpSubscription(perk);
      } else {
        model.setBumpExtra(perk);
      }
    } else if (perk.product_id === LISTINGS_ID) {
      if (perk.subscription_id !== null) {
        model.setListingSubscription(perk);
      }
    }
  });

  return model;
}
