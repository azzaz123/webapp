import { mapAmountAndCurrenyToMoney } from '@api/core/mappers';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import {
  CarrierDropOffModeRequest,
  DropOffModeRequest,
} from '@api/core/model/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request.interface';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';

export const MOCK_CARRIER_FREE_COST: DropOffModeRequest = {
  type: CARRIER_DROP_OFF_MODE.POST_OFFICE,
  icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
  postOfficeDetails: {
    carrier: POST_OFFICE_CARRIER.CORREOS,
    lastAddressUsed: null,
    selectionRequired: false,
  },
  sellerCosts: mapAmountAndCurrenyToMoney({ amount: 0.0, currency: 'EUR' }),
  acceptEndpoint: 'RANDOM_ENDPOINT',
  restrictions: '',
  schedule: null,
};

export const MOCK_CARRIER_ONE_EURO_COST: DropOffModeRequest = {
  type: CARRIER_DROP_OFF_MODE.HOME_PICK_UP,
  icon: 'http://prod-delivery-resources.wallapop.com/Seur.png',
  postOfficeDetails: {
    carrier: POST_OFFICE_CARRIER.SEUR,
    lastAddressUsed: null,
    selectionRequired: false,
  },
  sellerCosts: mapAmountAndCurrenyToMoney({ amount: 1, currency: 'EUR' }),
  acceptEndpoint: 'RANDOM_ENDPOINT_2',
  restrictions: '',
  schedule: null,
};

export const MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED: DropOffModeRequest = {
  type: CARRIER_DROP_OFF_MODE.HOME_PICK_UP,
  icon: 'http://prod-delivery-resources.wallapop.com/Seur.png',
  postOfficeDetails: null,
  sellerCosts: mapAmountAndCurrenyToMoney({ amount: 2.25, currency: 'EUR' }),
  acceptEndpoint: '/api/v3/delivery/seller/requests/ad39c2dd-7632-4354-ae95-fd324065038d/accept/home-pickup',
  restrictions:
    'The sum of the length plus twice the height and twice the width cannot exceed 300 cm, and the longest side cannot exceed 175 cm. Please, keep it in mind!',
  schedule: {
    isEditable: true,
    pickUpEndDate: new Date('2022-01-25T19:00:00Z'),
    pickUpStartDate: new Date('2022-01-25T08:00:00Z'),
  },
};

export const MOCK_CARRIER_PO_WITH_LAST_ADDRESS_BUYER_ADDRESS: DropOffModeRequest = {
  type: CARRIER_DROP_OFF_MODE.POST_OFFICE,
  icon: 'random icon',
  postOfficeDetails: {
    carrier: POST_OFFICE_CARRIER.CORREOS,
    lastAddressUsed: {
      buyerAddress: {
        id: '21',
        fullName: 'AABB',
        street: 'C/ Sol',
        postalCode: '08027',
        city: 'Barcelona',
        region: 'Catalunya',
        phoneNumber: '655476854',
        flatAndFloor: '2-1',
        country: 'Spain',
      },
      deliveryMode: DELIVERY_MODE.BUYER_ADDRESS,
      officeAddress: {
        id: '23826387263',
        unit: 2,
        city: 'Barcelona',
        postalCode: '08010',
        street: 'Rambla',
      },
    },
    selectionRequired: true,
  },
  sellerCosts: mapAmountAndCurrenyToMoney({ amount: 4, currency: 'EUR' }),
  acceptEndpoint: 'random value',
  restrictions: '',
  schedule: null,
};

export const MOCK_CARRIER_PO_WITH_LAST_ADDRESS_CARRIER_OFFICE: DropOffModeRequest = {
  type: CARRIER_DROP_OFF_MODE.POST_OFFICE,
  icon: 'random icon',
  postOfficeDetails: {
    carrier: POST_OFFICE_CARRIER.CORREOS,
    lastAddressUsed: {
      buyerAddress: {
        id: '21',
        fullName: 'AABB',
        street: 'C/ Sol',
        postalCode: '08027',
        city: 'Barcelona',
        region: 'Catalunya',
        phoneNumber: '655476854',
        flatAndFloor: '2-1',
        country: 'Spain',
      },
      deliveryMode: DELIVERY_MODE.CARRIER_OFFICE,
      officeAddress: {
        id: '23826387263',
        unit: 2,
        city: 'Barcelona',
        postalCode: '08010',
        street: 'Rambla',
      },
    },
    selectionRequired: false,
  },
  sellerCosts: mapAmountAndCurrenyToMoney({ amount: 1, currency: 'EUR' }),
  acceptEndpoint: 'random value',
  restrictions: '',
  schedule: null,
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST: CarrierDropOffModeRequest = {
  modes: [
    {
      type: CARRIER_DROP_OFF_MODE.POST_OFFICE,
      icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
      postOfficeDetails: {
        carrier: POST_OFFICE_CARRIER.CORREOS,
        lastAddressUsed: {
          buyerAddress: {
            id: '21',
            fullName: 'AABB',
            street: 'C/ Sol',
            postalCode: '08027',
            city: 'Barcelona',
            region: 'Catalunya',
            phoneNumber: '655476854',
            flatAndFloor: '2-1',
            country: 'Spain',
          },
          deliveryMode: DELIVERY_MODE.BUYER_ADDRESS,
          officeAddress: {
            id: '23826387263',
            unit: 2,
            city: 'Barcelona',
            postalCode: '08010',
            street: 'Rambla',
          },
        },
        selectionRequired: false,
      },
      sellerCosts: mapAmountAndCurrenyToMoney({ amount: 0.0, currency: 'EUR' }),
      acceptEndpoint: '/api/v3/delivery/seller/requests/ad39c2dd-7632-4354-ae95-fd324065038d/accept/post-office-drop-off',
      restrictions:
        'Please bear in mind that the sum of the length, height, and width cannot exceed 210 cm. The longest side cannot exceed 120 cm.',
      schedule: null,
    },
    {
      type: CARRIER_DROP_OFF_MODE.HOME_PICK_UP,
      icon: 'http://prod-delivery-resources.wallapop.com/Seur.png',
      postOfficeDetails: null,
      sellerCosts: mapAmountAndCurrenyToMoney({ amount: 2.25, currency: 'EUR' }),
      acceptEndpoint: '/api/v3/delivery/seller/requests/ad39c2dd-7632-4354-ae95-fd324065038d/accept/home-pickup',
      restrictions:
        'The sum of the length plus twice the height and twice the width cannot exceed 300 cm, and the longest side cannot exceed 175 cm. Please, keep it in mind!',
      schedule: {
        isEditable: true,
        pickUpEndDate: new Date('2022-01-25T19:00:00Z'),
        pickUpStartDate: new Date('2022-01-25T08:00:00Z'),
      },
    },
  ],
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_EMPTY: CarrierDropOffModeRequest = {
  modes: [],
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_EURO_COST: CarrierDropOffModeRequest = {
  modes: [MOCK_CARRIER_FREE_COST, MOCK_CARRIER_ONE_EURO_COST],
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_FREE_AND_ONE_HPU_WITH_SCHEDULE_DEFINED: CarrierDropOffModeRequest = {
  modes: [MOCK_CARRIER_FREE_COST, MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED],
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_PO_WITH_BUYER_ADDRESS_AND_ONE_HPU_WITH_SCHEDULE_DEFINED: CarrierDropOffModeRequest = {
  modes: [MOCK_CARRIER_PO_WITH_LAST_ADDRESS_BUYER_ADDRESS, MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED],
};

export const MOCK_CARRIER_DROP_OFF_MODE_REQUEST_ONE_PO_WITH_CARRIER_OFFICE_AND_ONE_HPU_WITH_SCHEDULE_DEFINED: CarrierDropOffModeRequest = {
  modes: [MOCK_CARRIER_PO_WITH_LAST_ADDRESS_CARRIER_OFFICE, MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED],
};
