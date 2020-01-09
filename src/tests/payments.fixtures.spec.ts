import { PurchasingItem, Purchase, AutorenewItem } from '../app/core/payments/purchase.interface';
import { PerksModel } from '../app/core/payments/payment.model';
import { getMockItem } from './item.fixtures.spec';
import { COINS_PACK_ID, CREDITS_PACK_ID, Pack } from '../app/core/payments/pack';
import {
  BillingInfoResponse,
  Packs,
  PackResponse,
  ProductResponse,
  OrderProExtras,
  PerkResponse, PaymentMethodCardResponse, FinancialCard, PaymentMethodResponse
} from '../app/core/payments/payment.interface';
import { PurchasesModel } from '../app/core/payments/purchase.model';
import { STRIPE_CARD } from './stripe.fixtures.spec';

export const FINANCIAL_CARD: FinancialCard = {
  expire_date: 61598188800000,
  id: '06553101-a47d-45cb-b4e0-6f9d8e89014b',
  number: '1234***********1111'
};

export const FINANCIAL_STRIPE_CARD: FinancialCard = {
  expire_date: '01/2021',
  id: 'pm_2f2f2f',
  number: '4242',
  favorite: true,
  stripeCard: {
    brand: null,
    checks: null,
    country: null,
    exp_month: 2,
    exp_year: 2020,
    funding: null,
    generated_from: null,
    last4: '4242',
    three_d_secure_usage: { supported : null },
    wallet: null
  }
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
    listings: [],
    wallacoins: [],
    wallacredits: []
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

export const WALLACOINS_PACKS_RESPONSE: PackResponse[] = [{
  'id': '05265bfc-423d-4e38-989b-7079c83ca4d7',
  'benefits': {[COINS_PACK_ID]: 5500.00},
  'price': '50.00',
  'original_price': '55.00',
  'currency': 'EUR'
}, {
  'id': '2756ccaf-d59b-4fab-9758-163cc52f5246',
  'benefits': {[COINS_PACK_ID]: 29000.00},
  'price': '250.00',
  'original_price': '290.00',
  'currency': 'EUR'
}, {
  'id': '8913678e-b1a2-47c4-a954-5257dfc1df85',
  'benefits': {[COINS_PACK_ID]: 125000.00},
  'price': '1000.00',
  'original_price': '1250.00',
  'currency': 'EUR'
}, {
  'id': '994a1c68-c3dd-4e85-824e-8d1ae9d1a95a',
  'benefits': {[COINS_PACK_ID]: 11500.00},
  'price': '100.00',
  'original_price': '115.00',
  'currency': 'EUR'
}, {
  'id': 'e631c995-a9cb-4db3-a746-435b63dddc02',
  'benefits': {[COINS_PACK_ID]: 3000.00},
  'price': '30.00',
  'original_price': '30.00',
  'currency': 'EUR'
}, {
  'id': 'eaa7e591-6d86-4b62-94de-7ab8013a280b',
  'benefits': {[COINS_PACK_ID]: 60000.00},
  'price': '500.00',
  'original_price': '600.00',
  'currency': 'EUR'
}];

export const WALLACREDITS_PACKS_RESPONSE: PackResponse[] = [{
  'id': '05265bfc-423d-4e38-989b-7079c83ca4d7',
  'benefits': {[CREDITS_PACK_ID]: 5500.00},
  'price': '50.00',
  'original_price': '55.00',
  'currency': 'EUR'
}, {
  'id': '2756ccaf-d59b-4fab-9758-163cc52f5246',
  'benefits': {[CREDITS_PACK_ID]: 29000.00},
  'price': '250.00',
  'original_price': '290.00',
  'currency': 'EUR'
}, {
  'id': '8913678e-b1a2-47c4-a954-5257dfc1df85',
  'benefits': {[CREDITS_PACK_ID]: 125000.00},
  'price': '1000.00',
  'original_price': '1250.00',
  'currency': 'EUR'
}, {
  'id': '994a1c68-c3dd-4e85-824e-8d1ae9d1a95a',
  'benefits': {[CREDITS_PACK_ID]: 11500.00},
  'price': '100.00',
  'original_price': '115.00',
  'currency': 'EUR'
}, {
  'id': 'e631c995-a9cb-4db3-a746-435b63dddc02',
  'benefits': {[CREDITS_PACK_ID]: 3000.00},
  'price': '30.00',
  'original_price': '30.00',
  'currency': 'EUR'
}, {
  'id': 'eaa7e591-6d86-4b62-94de-7ab8013a280b',
  'benefits': {[CREDITS_PACK_ID]: 60000.00},
  'price': '500.00',
  'original_price': '600.00',
  'currency': 'EUR'
}];

export function createWallacoinsPacksFixture(): Packs {
  const PACKS: Packs = {
    cityBump: [],
    countryBump: [],
    listings: [],
    wallacoins: [],
    wallacredits: []
  };
  const packWallacoins = new Pack(
    WALLACOINS_PACKS_RESPONSE[4].id,
    WALLACOINS_PACKS_RESPONSE[4].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[4].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[4].price, +WALLACOINS_PACKS_RESPONSE[4].original_price);
  const packWallacoins2 = new Pack(
    WALLACOINS_PACKS_RESPONSE[0].id,
    WALLACOINS_PACKS_RESPONSE[0].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[0].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins2.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[0].price, +WALLACOINS_PACKS_RESPONSE[0].original_price);
  const packWallacoins3 = new Pack(
    WALLACOINS_PACKS_RESPONSE[3].id,
    WALLACOINS_PACKS_RESPONSE[3].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[3].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins3.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[3].price, +WALLACOINS_PACKS_RESPONSE[3].original_price);
  const packWallacoins4 = new Pack(
    WALLACOINS_PACKS_RESPONSE[1].id,
    WALLACOINS_PACKS_RESPONSE[1].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[1].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins4.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[1].price, +WALLACOINS_PACKS_RESPONSE[1].original_price);
  const packWallacoins5 = new Pack(
    WALLACOINS_PACKS_RESPONSE[5].id,
    WALLACOINS_PACKS_RESPONSE[5].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[5].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins5.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[5].price, +WALLACOINS_PACKS_RESPONSE[5].original_price);
  const packWallacoins6 = new Pack(
    WALLACOINS_PACKS_RESPONSE[2].id,
    WALLACOINS_PACKS_RESPONSE[2].benefits[COINS_PACK_ID],
    +WALLACOINS_PACKS_RESPONSE[2].price,
    'EUR',
    'wallacoins'
  );
  packWallacoins6.calculateDiscountWithOriginalPrice(+WALLACOINS_PACKS_RESPONSE[2].price, +WALLACOINS_PACKS_RESPONSE[2].original_price);
  PACKS.wallacoins.push(packWallacoins);
  PACKS.wallacoins.push(packWallacoins2);
  PACKS.wallacoins.push(packWallacoins3);
  PACKS.wallacoins.push(packWallacoins4);
  PACKS.wallacoins.push(packWallacoins5);

  PACKS.wallacoins.push(packWallacoins6);
  return PACKS;
}

export function createWallacreditsPacksFixture(): Packs {
  const PACKS: Packs = {
    cityBump: [],
    countryBump: [],
    listings: [],
    wallacoins: [],
    wallacredits: []
  };
  const packWallacredits = new Pack(
    WALLACREDITS_PACKS_RESPONSE[4].id,
    WALLACREDITS_PACKS_RESPONSE[4].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[4].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[4].price, +WALLACREDITS_PACKS_RESPONSE[4].original_price);
  const packWallacredits2 = new Pack(
    WALLACREDITS_PACKS_RESPONSE[0].id,
    WALLACREDITS_PACKS_RESPONSE[0].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[0].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits2.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[0].price, +WALLACREDITS_PACKS_RESPONSE[0].original_price);
  const packWallacredits3 = new Pack(
    WALLACREDITS_PACKS_RESPONSE[3].id,
    WALLACREDITS_PACKS_RESPONSE[3].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[3].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits3.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[3].price, +WALLACREDITS_PACKS_RESPONSE[3].original_price);
  const packWallacredits4 = new Pack(
    WALLACREDITS_PACKS_RESPONSE[1].id,
    WALLACREDITS_PACKS_RESPONSE[1].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[1].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits4.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[1].price, +WALLACREDITS_PACKS_RESPONSE[1].original_price);
  const packWallacredits5 = new Pack(
    WALLACREDITS_PACKS_RESPONSE[5].id,
    WALLACREDITS_PACKS_RESPONSE[5].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[5].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits5.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[5].price, +WALLACREDITS_PACKS_RESPONSE[5].original_price);
  const packWallacredits6 = new Pack(
    WALLACREDITS_PACKS_RESPONSE[2].id,
    WALLACREDITS_PACKS_RESPONSE[2].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[2].price,
    'EUR',
    'wallacredits'
  );
  packWallacredits6.calculateDiscountWithOriginalPrice(+WALLACREDITS_PACKS_RESPONSE[2].price, +WALLACREDITS_PACKS_RESPONSE[2].original_price);
  PACKS.wallacredits.push(packWallacredits);
  PACKS.wallacredits.push(packWallacredits2);
  PACKS.wallacredits.push(packWallacredits3);
  PACKS.wallacredits.push(packWallacredits4);
  PACKS.wallacredits.push(packWallacredits5);
  PACKS.wallacredits.push(packWallacredits6);
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
    packs: [(createPacksFixture()).cityBump[0], (createPacksFixture()).countryBump[0]]
  },
  {
    quantity: 5,
    packs: [(createPacksFixture()).cityBump[1], (createPacksFixture()).countryBump[1]]
  },
  {
    quantity: 15,
    packs: [(createPacksFixture()).cityBump[2], (createPacksFixture()).countryBump[2]]
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
  create_date: 21342344,
  expire_date: 21342344,
  perk_id: '123',
  product_id: NATIONAL_BUMP_ID,
  quantity: NATIONAL_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  create_date: 21342344,
  expire_date: 21342344,
  perk_id: '1234',
  product_id: BUMP_ID,
  quantity: BUMP_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  create_date: 21342344,
  expire_date: 21342344,
  perk_id: '1234',
  product_id: LISTINGS_ID,
  quantity: LISTINGS_QUANTITY,
  subscription_id: SUBSCRIPTION_ID,
  total: 0
}, {
  create_date: 21342344,
  expire_date: 21342344,
  perk_id: '123',
  product_id: NATIONAL_BUMP_ID,
  quantity: NATIONAL_QUANTITY,
  subscription_id: null,
  total: 0
}, {
  create_date: 21342344,
  expire_date: 21342344,
  perk_id: '1234',
  product_id: BUMP_ID,
  quantity: BUMP_QUANTITY,
  subscription_id: null,
  total: 0
}];

export const PAYMENT_METHOD_CARD_RESPONSE: PaymentMethodCardResponse[] = [
  {
    brand: null,
    default: true,
    expiration_month: 2,
    expiration_year: 2020,
    id: 'pm_a0b1c2',
    last_digits: '4242'
  },
  {
    brand: null,
    default: false,
    expiration_month: 4,
    expiration_year: 2024,
    id: 'pm_d3e4f5',
    last_digits: '2121'
  }
];

export const PAYMENT_METHOD_DATA: PaymentMethodResponse = {
  billing_details: null,
  card: STRIPE_CARD,
  created: 8891123123,
  customer: 'testuser',
  id: 'pm_a0b1c2',
  livemode: false,
  metadata: null,
  object: '',
  type: ''
};

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
