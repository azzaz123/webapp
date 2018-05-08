import { FinancialCard, SabadellInfoResponse, Packs } from '../app/core/payments/payment.interface';
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
  packCityBump.calculateDiscount('5.99', 5.99, 5.99);
  const packCityBumpSecond = new Pack(
    '2',
    5,
    15.99,
    'EUR',
    'cityBump'
  );
  packCityBumpSecond.calculateDiscount('15.99', 5.99, 15.99);
  const packCityBumpThird = new Pack(
    '3',
    15,
    25.99,
    'EUR',
    'cityBump'
  );
  packCityBumpThird.calculateDiscount('25.99', 5.99, 25.99);
  PACKS.cityBump.push(packCityBump);
  PACKS.cityBump.push(packCityBumpSecond);
  PACKS.cityBump.push(packCityBumpThird);
  const packNationalBump = new Pack(
    '4',
    1,
    8.99,
    'EUR',
    'nationalBump'
  );
  packNationalBump.calculateDiscount('8.99', 8.99, 8.99);
  const packNationalBumpSecond = new Pack(
    '5',
    5,
    18.99,
    'EUR',
    'nationalBump'
  );
  packNationalBumpSecond.calculateDiscount('18.99', 8.99, 18.99);
  const packNationalBumpThird = new Pack(
    '6',
    15,
    28.99,
    'EUR',
    'nationalBump'
  );
  packNationalBumpThird.calculateDiscount('28.99', 8.99, 28.99);
  PACKS.countryBump.push(packNationalBump);
  PACKS.countryBump.push(packNationalBumpSecond);
  PACKS.countryBump.push(packNationalBumpThird);

  return PACKS;
}

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
