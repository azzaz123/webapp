import { AcceptScreenCarrier } from '@private/features/accept-screen/interfaces';
import {
  MOCK_CARRIER_FREE_COST,
  MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED,
  MOCK_CARRIER_ONE_EURO_COST,
  MOCK_CARRIER_PO_WITH_LAST_ADDRESS,
} from './carrier-drop-off-mode-request.fixtures.spec';
import {
  AcceptScreenDropOffPointButtonTranslations,
  AcceptScreenDropOffPointTitle,
} from '@private/features/accept-screen/constants/accept-screen-translations';
import { ACCEPT_SCREEN_STEPS } from '@private/features/accept-screen/constants/accept-screen-steps';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';

const freeCostTranslation: string = $localize`:@@accept_view_seller_delivery_method_selector_free_text:FREE`;
const MOCK_PICK_UP_START_DATE: string = MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.schedule.pickUpStartDate.toLocaleTimeString(
  navigator.language,
  {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
);
const MOCK_PICK_UP_END_DATE: string = MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.schedule.pickUpEndDate.toLocaleTimeString(navigator.language, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED_INFORMATION: string = $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_pickup_date_description:The package will be picked up at your address on ${
  'Tuesday, 25 January 2022, ' + MOCK_PICK_UP_START_DATE + ' - ' + MOCK_PICK_UP_END_DATE + '.'
}`;

export const MOCK_ACCEPT_SCREEN_CARRIERS: AcceptScreenCarrier[] = [
  {
    type: MOCK_CARRIER_FREE_COST.type,
    name: MOCK_CARRIER_FREE_COST.postOfficeDetails.carrier,
    isSelected: false,
    icon: MOCK_CARRIER_FREE_COST.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_FREE_COST.type],
    price: freeCostTranslation,
    information: $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`,
    secondaryInformation: null,
    restrictions: MOCK_CARRIER_FREE_COST.restrictions,
    buttonProperties: {
      isShowed: true,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_FREE_COST.type],
      redirectStep: ACCEPT_SCREEN_STEPS.MAP,
    },
    acceptEndpoint: MOCK_CARRIER_FREE_COST.acceptEndpoint,
    lastAddressUsedId: null,
  },
  {
    type: MOCK_CARRIER_ONE_EURO_COST.type,
    name: MOCK_CARRIER_ONE_EURO_COST.postOfficeDetails.carrier,
    isSelected: true,
    icon: MOCK_CARRIER_ONE_EURO_COST.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_ONE_EURO_COST.type],
    price: MOCK_CARRIER_ONE_EURO_COST.sellerCosts.toString(),
    information: null,
    secondaryInformation: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_service_fee_description:The cost of the service will be deducted from your sale.`,
    restrictions: MOCK_CARRIER_ONE_EURO_COST.restrictions,
    buttonProperties: {
      isShowed: false,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_ONE_EURO_COST.type],
      redirectStep: ACCEPT_SCREEN_STEPS.SCHEDULE,
    },
    acceptEndpoint: MOCK_CARRIER_ONE_EURO_COST.acceptEndpoint,
    lastAddressUsedId: null,
  },
];

export const MOCK_ACCEPT_SCREEN_CARRIERS_2: AcceptScreenCarrier[] = [
  { ...MOCK_ACCEPT_SCREEN_CARRIERS[0], isSelected: true },
  { ...MOCK_ACCEPT_SCREEN_CARRIERS[1], isSelected: false },
];

export const MOCK_ACCEPT_SCREEN_CARRIERS_SECOND_WITH_SCHEDULE_DEFINED: AcceptScreenCarrier[] = [
  {
    type: MOCK_CARRIER_FREE_COST.type,
    name: MOCK_CARRIER_FREE_COST.postOfficeDetails.carrier,
    isSelected: true,
    icon: MOCK_CARRIER_FREE_COST.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_FREE_COST.type],
    price: freeCostTranslation,
    information: $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`,
    secondaryInformation: null,
    restrictions: MOCK_CARRIER_FREE_COST.restrictions,
    buttonProperties: {
      isShowed: true,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_FREE_COST.type],
      redirectStep: ACCEPT_SCREEN_STEPS.MAP,
    },
    acceptEndpoint: MOCK_CARRIER_FREE_COST.acceptEndpoint,
    lastAddressUsedId: null,
  },
  {
    type: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type,
    name: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.postOfficeDetails.carrier,
    isSelected: false,
    icon: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type],
    price: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.sellerCosts.toString(),
    information: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED_INFORMATION,
    secondaryInformation: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_service_fee_description:The cost of the service will be deducted from your sale.`,
    restrictions: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.restrictions,
    buttonProperties: {
      isShowed: true,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type],
      redirectStep: ACCEPT_SCREEN_STEPS.SCHEDULE,
    },
    deliveryPickUpDay: 'Tuesday, 25 January 2022',
    acceptEndpoint: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.acceptEndpoint,
    lastAddressUsedId: null,
  },
];

export const MOCK_ACCEPT_SCREEN_CARRIERS_FIRST_WITH_LAST_ADDRESS: AcceptScreenCarrier[] = [
  {
    type: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type,
    name: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.postOfficeDetails.carrier,
    isSelected: true,
    icon: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type],
    price: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.sellerCosts.toString(),
    information: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED_INFORMATION,
    secondaryInformation: $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_service_fee_description:The cost of the service will be deducted from your sale.`,
    restrictions: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.restrictions,
    buttonProperties: {
      isShowed: true,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.type],
      redirectStep: ACCEPT_SCREEN_STEPS.SCHEDULE,
    },
    deliveryPickUpDay: 'Tuesday, 25 January 2022',
    acceptEndpoint: MOCK_CARRIER_HPU_WITH_SCHEDULE_DEFINED.acceptEndpoint,
    lastAddressUsedId: null,
  },
  {
    type: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.type,
    name: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.postOfficeDetails.carrier,
    isSelected: false,
    icon: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.icon,
    title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_PO_WITH_LAST_ADDRESS.type],
    price: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.sellerCosts.toString(),
    information: $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`,
    secondaryInformation: $localize`:@@accept_view_seller_po_all_delivery_method_selector_collection_point_address_description:Drop-off point: ${'This is the last address used'}:INTERPOLATION:`,
    restrictions: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.restrictions,
    buttonProperties: {
      isShowed: true,
      text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_PO_WITH_LAST_ADDRESS.type],
      redirectStep: ACCEPT_SCREEN_STEPS.MAP,
    },
    acceptEndpoint: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.acceptEndpoint,
    lastAddressUsedId: MOCK_CARRIER_PO_WITH_LAST_ADDRESS.postOfficeDetails.lastAddressUsed.id,
  },
];

export const MOCK_ACCEPT_SCREEN_CARRIER_WITH_DELIVERY_PICK_UP_DAY: AcceptScreenCarrier = {
  type: MOCK_CARRIER_FREE_COST.type,
  name: POST_OFFICE_CARRIER.SEUR,
  isSelected: false,
  icon: MOCK_CARRIER_FREE_COST.icon,
  title: AcceptScreenDropOffPointTitle[MOCK_CARRIER_FREE_COST.type],
  price: freeCostTranslation,
  information: $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`,
  secondaryInformation: null,
  restrictions: MOCK_CARRIER_FREE_COST.restrictions,
  buttonProperties: {
    isShowed: true,
    text: AcceptScreenDropOffPointButtonTranslations[MOCK_CARRIER_FREE_COST.type],
    redirectStep: ACCEPT_SCREEN_STEPS.MAP,
  },
  acceptEndpoint: MOCK_CARRIER_FREE_COST.acceptEndpoint,
  lastAddressUsedId: '6d79d56f-3688-4c50-b4e4-d8b597492f71',
  deliveryPickUpDay: 'Tuesday, 25 January 2022',
};
