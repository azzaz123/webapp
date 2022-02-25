import { ToDomainMapper } from '@api/core/utils/types/to-domain-mapper.type';
import { Item } from '@core/item/item';
import { User, PLACEHOLDER_AVATAR } from '@core/user/user';
import { mapNumberAndCurrencyCodeToMoney, NumberCurrencyCode } from '@api/core/mappers/money/money-mapper';
import { CurrencyCode } from '@api/core/model/currency.interface';
import {
  AcceptScreenItem,
  AcceptScreenSeller,
  AcceptScreenBuyer,
  AcceptScreenCarrier,
  AcceptScreenCarrierButtonProperties,
} from '@private/features/accept-screen/interfaces';
import { CarrierDropOffModeRequest, DropOffModeRequest, TentativeSchedule } from '@api/core/model/delivery/carrier-drop-off-mode';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { FALLBACK_NOT_FOUND_SRC } from '@private/core/constants/fallback-images-src-constants';
import { Money } from '@api/core/model/money.interface';
import { ACCEPT_SCREEN_STEPS } from '../../constants/accept-screen-steps';
import { LastAddressUsed } from '@api/core/model/delivery/buyer/delivery-methods';
import {
  AcceptScreenDropOffPointButtonTranslations,
  AcceptScreenDropOffPointTitle,
} from '@private/features/accept-screen/constants/accept-screen-translations';

const navigatorLanguage: string = navigator.language;

export const mapItemToAcceptScreenItem: ToDomainMapper<Item, AcceptScreenItem> = (item: Item): AcceptScreenItem => {
  const itemCurrencyPrice: NumberCurrencyCode = {
    number: item.salePrice,
    currency: item.currencyCode as CurrencyCode,
  };
  return {
    id: item.id,
    title: item.title,
    price: mapNumberAndCurrencyCodeToMoney(itemCurrencyPrice),
    imageUrl: item.images ? item.images[0].urls_by_size.original : FALLBACK_NOT_FOUND_SRC,
  };
};

export function mapUserToAcceptScreenSeller(seller: User, address: DeliveryAddressApi): AcceptScreenSeller {
  return {
    id: seller.id,
    imageUrl: mapUserToImageUrl(seller),
    fullAddress: address ? mapDeliveryAddressToSellerAddress(address) : null,
  };
}

export const mapUserToAcceptScreenBuyer: ToDomainMapper<User, AcceptScreenBuyer> = (buyer: User): AcceptScreenBuyer => {
  return {
    id: buyer.id,
    imageUrl: mapUserToImageUrl(buyer),
    name: buyer.microName,
  };
};

export function mapCarrierDropOffModeToAcceptScreenCarriers(
  input: CarrierDropOffModeRequest,
  dropOffModeSelectedByUser: CARRIER_DROP_OFF_MODE
): AcceptScreenCarrier[] {
  if (!input.modes || input.modes.length === 0) return [];

  const dropOffSorteredByCost: DropOffModeRequest[] = input.modes.sort(
    (dropOffModeA: DropOffModeRequest, dropOffModeB: DropOffModeRequest) =>
      dropOffModeA.sellerCosts.amount.total - dropOffModeB.sellerCosts.amount.total
  );
  const dropOffSelected: CARRIER_DROP_OFF_MODE = dropOffModeSelectedByUser || dropOffSorteredByCost[0].type;

  return dropOffSorteredByCost.map((dropOffModeRequest: DropOffModeRequest) => {
    return mapCarrier(dropOffModeRequest, dropOffSelected);
  });
}

const mapDeliveryAddressToSellerAddress: ToDomainMapper<DeliveryAddressApi, string> = (input: DeliveryAddressApi): string => {
  const flatAndFloor: string = input.flat_and_floor ? ` ${input.flat_and_floor},` : '';
  return `${input.street},${flatAndFloor} ${input.postal_code}, ${input.city}`;
};

function mapCarrier(dropOffMode: DropOffModeRequest, carrierDropOffModeSelected: CARRIER_DROP_OFF_MODE): AcceptScreenCarrier {
  const carrier: AcceptScreenCarrier = getCarrier(dropOffMode, carrierDropOffModeSelected);

  const deliveryPickUpDay: string = mapDeliveryPickUpDay(dropOffMode.type, dropOffMode.schedule);
  if (deliveryPickUpDay) {
    carrier.deliveryPickUpDay = deliveryPickUpDay;
  }

  return carrier;
}

function getCarrier(dropOffMode: DropOffModeRequest, carrierDropOffModeSelected: CARRIER_DROP_OFF_MODE): AcceptScreenCarrier {
  return {
    type: dropOffMode.type,
    isSelected: dropOffMode.type === carrierDropOffModeSelected,
    icon: dropOffMode.icon,
    title: mapTitle(dropOffMode.type),
    price: mapPrice(dropOffMode.sellerCosts),
    information: mapInformation(dropOffMode.type, dropOffMode.schedule),
    secondaryInformation: mapSecondaryInformation(dropOffMode.type, dropOffMode.postOfficeDetails?.lastAddressUsed),
    restrictions: dropOffMode.restrictions,
    buttonProperties: mapButtonProperties(
      dropOffMode.type,
      !!dropOffMode.schedule?.isEditable,
      !!dropOffMode.postOfficeDetails?.selectionRequired
    ),
    acceptEndpoint: dropOffMode.acceptEndpoint,
  };
}

const mapUserToImageUrl: ToDomainMapper<User, string> = (user: User): string => {
  return user.image?.urls_by_size.original || PLACEHOLDER_AVATAR;
};

const mapTitle: ToDomainMapper<CARRIER_DROP_OFF_MODE, string> = (type: CARRIER_DROP_OFF_MODE): string => {
  return AcceptScreenDropOffPointTitle[type];
};

function mapDeliveryPickUpDay(type: CARRIER_DROP_OFF_MODE, schedule: TentativeSchedule) {
  if (type === CARRIER_DROP_OFF_MODE.POST_OFFICE || !schedule) {
    return null;
  }

  const startDate: Date = schedule.pickUpStartDate;

  return `${mapWeekDay(startDate)}, ${mapCompleteDate(startDate)}`;
}

function mapInformation(type: CARRIER_DROP_OFF_MODE, schedule: TentativeSchedule): string {
  const scheduleMapped: string = schedule ? mapDeliveryDayInformation(schedule) : null;

  if (type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP) {
    return scheduleMapped
      ? $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_pickup_date_description:The package will be picked up at your address on ${scheduleMapped}:INTERPOLATION:`
      : null;
  }

  if (type === CARRIER_DROP_OFF_MODE.POST_OFFICE) {
    return $localize`:@@accept_view_seller_po_all_delivery_method_selector_time_limit_description:You have 5 days to drop off the package.`;
  }
}

function mapSecondaryInformation(type: CARRIER_DROP_OFF_MODE, lastAddressUsed: LastAddressUsed): string {
  const lastAddressUsedMapped: string = lastAddressUsed ? mapDropOffPointInformation(lastAddressUsed) : null;

  if (type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP) {
    return $localize`:@@accept_view_seller_hpu_ba_delivery_method_selector_service_fee_description:The cost of the service will be deducted from your sale.`;
  }

  if (type === CARRIER_DROP_OFF_MODE.POST_OFFICE) {
    return lastAddressUsedMapped
      ? $localize`:@@accept_view_seller_po_all_delivery_method_selector_collection_point_address_description:Drop-off point: ${lastAddressUsedMapped}:INTERPOLATION:`
      : null;
  }
}

function mapButtonProperties(
  type: CARRIER_DROP_OFF_MODE,
  isScheduleEditable: boolean,
  isPostOfficeEditable: boolean
): AcceptScreenCarrierButtonProperties {
  const redirectStep: ACCEPT_SCREEN_STEPS =
    type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? ACCEPT_SCREEN_STEPS.SCHEDULE : ACCEPT_SCREEN_STEPS.MAP;
  const isShowed: boolean = type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? isScheduleEditable : isPostOfficeEditable;

  return {
    isShowed,
    text: AcceptScreenDropOffPointButtonTranslations[type],
    redirectStep,
  };
}

const mapPrice: ToDomainMapper<Money, string> = (sellerCosts: Money): string => {
  const deliveryMethodFreeTranslation: string = $localize`:@@accept_view_seller_delivery_method_selector_free_text:FREE`;
  return sellerCosts.amount.total <= 0 ? deliveryMethodFreeTranslation : sellerCosts.toString();
};

const mapDropOffPointInformation: ToDomainMapper<LastAddressUsed, string> = (lastAddressUsed: LastAddressUsed): string => {
  return lastAddressUsed.label;
};

const mapDeliveryDayInformation: ToDomainMapper<TentativeSchedule, string> = (schedule: TentativeSchedule): string => {
  const startDate: Date = schedule.pickUpStartDate;
  const hourStart: string = getHourAndMinutesFromDate(startDate);
  const hourEnd: string = getHourAndMinutesFromDate(schedule.pickUpEndDate);

  return `${mapWeekDay(startDate)}, ${mapCompleteDate(startDate)}, ${hourStart} - ${hourEnd}.`;
};

const mapWeekDay: ToDomainMapper<Date, string> = (date: Date): string => {
  return capitalizeFirstLetter(date.toLocaleDateString(navigatorLanguage, { weekday: 'long' }).toLowerCase());
};

const mapCompleteDate: ToDomainMapper<Date, string> = (date: Date): string => {
  const month: string = date.toLocaleDateString(navigatorLanguage, {
    month: 'long',
  });

  return `${date.getUTCDate()} ${month} ${date.getFullYear()}`;
};

const getHourAndMinutesFromDate: ToDomainMapper<Date, string> = (date: Date): string => {
  return date.toLocaleTimeString(navigatorLanguage, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const capitalizeFirstLetter: ToDomainMapper<string, string> = (text: string): string => {
  const lowerCaseText: string = text.toLowerCase();
  return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);
};
