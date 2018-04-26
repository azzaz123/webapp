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

export const SUBSCRIPTION_PACKS: PackResponse[] = [
  {
    'id': '27900eeb-3a31-401d-be35-a0fdc31ac020',
    'benefits': {
      'dc29027d-274d-4c0c-bdb6-155130db000d': 25
    },
    'price': '9.99',
    'currency': 'EUR'
  },
  {
    'id': '5ae4f5e2-335d-44e0-ab39-61aa69ea9b49',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 10
    },
    'price': '10.00',
    'currency': 'EUR'
  },
  {
    'id': '22fe2488-2a95-4553-b408-7cf4d22a4489',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 20
    },
    'price': '20.00',
    'currency': 'EUR'
  },
  {
    'id': '00829522-46fe-4e5b-98b6-a13a9371e9d3',
    'benefits': {
      '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66': 25
    },
    'price': '22.99',
    'currency': 'EUR'
  },
  {
    'id': '6982a266-4dc6-4db0-ae7a-dc2953e46923',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 30
    },
    'price': '30.00',
    'currency': 'EUR'
  },
  {
    'id': '25c168d4-3a8a-4bea-b5ea-9ff80fb275b7',
    'benefits': {
      'dc29027d-274d-4c0c-bdb6-155130db000d': 90
    },
    'price': '32.99',
    'currency': 'EUR'
  },
  {
    'id': '5d72657f-dec2-4a71-9e3b-a1356296c6d8',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 50
    },
    'price': '50.00',
    'currency': 'EUR'
  },
  {
    'id': 'dea959b3-d7a8-46ed-b91f-48dddac9a2c4',
    'benefits': {
      'dc29027d-274d-4c0c-bdb6-155130db000d': 300
    },
    'price': '54.99',
    'currency': 'EUR'
  },
  {
    'id': 'b29e3a66-c86d-4c58-9e0b-b50518038fed',
    'benefits': {
      '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66': 90
    },
    'price': '74.99',
    'currency': 'EUR'
  },
  {
    'id': '91fb3b46-252f-4f88-b4fd-c7c488d8e614',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 75
    },
    'price': '75.00',
    'currency': 'EUR'
  },
  {
    'id': '170fc36c-0123-4296-9eaa-8eb47949c95e',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 100
    },
    'price': '100.00',
    'currency': 'EUR'
  },
  {
    'id': '311230d7-c6f3-4d23-8ad7-04a4782a080b',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 150
    },
    'price': '150.00',
    'currency': 'EUR'
  },
  {
    'id': '1c510f77-1b37-485f-8b2a-e87438b908d4',
    'benefits': {
      '50ebcb0f-7fa5-4c02-be60-e2dbca80fe66': 300
    },
    'price': '199.99',
    'currency': 'EUR'
  },
  {
    'id': 'fd06f6a9-5d1b-4575-9d2c-8ee35b9efce8',
    'benefits': {
      '799a7381-0eae-4a47-a03b-b412ea0f7a2e': 200
    },
    'price': '300.00',
    'currency': 'EUR'
  }
];
