import {
  FinancialCard, SabadellInfoResponse, PerkResponse,
  ProductResponse
} from '../app/core/payments/payment.interface';
import { PurchasingItem, Purchase, AutorenewItem } from '../app/core/payments/purchase.interface';
import { PerksModel } from '../app/core/payments/payment.model';

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
  'autorenew': false
}, {
  'item_id': '2',
  'expiration_date': 1496215651120,
  'boost': true,
  'highlight': false,
  'national': false,
  'bump': true,
  'autorenew': true
}, {
  'item_id': '3',
  'expiration_date': 1495870049678,
  'boost': false,
  'highlight': true,
  'national': true,
  'bump': false,
  'autorenew': true
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

export const NATIONAL_BUMP_ID: string = '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66';
export const BUMP_ID: string = 'dc29027d-274d-4c0c-bdb6-155130db000d';
export const LISTINGS_ID: string = '799a7381-0eae-4a47-a03b-b412ea0f7a2e';
export const SUBSCRIPTION_ID: string = '1';

export const PRODUCT_RESPONSE: ProductResponse[] = [{
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
