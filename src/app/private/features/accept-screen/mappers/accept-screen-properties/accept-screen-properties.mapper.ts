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
  AcceptScreenDropOffPoint,
  AcceptScreenHomePickUp,
  AcceptScreenCarrierButtonProperties,
} from '@private/features/accept-screen/interfaces';
import {
  CarrierDropOffModeRequest,
  DropOffModeRequest,
  LastAddressUsed,
  TentativeSchedule,
} from '@api/core/model/delivery/carrier-drop-off-mode';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { FALLBACK_NOT_FOUND_SRC } from '@private/core/constants/fallback-images-src-constants';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { AcceptScreenDeliveryAddress } from '../../interfaces/accept-screen-delivery-address.interface';
import { Money } from '@api/core/model/money.interface';
import {
  AcceptScreenDropOffPointButtonTranslations,
  AcceptScreenDropOffPointInformation,
  AcceptScreenDropOffPointSecondInformation,
  AcceptScreenDropOffPointTitle,
} from '../../constants/accept-screen-translations';
import { ACCEPT_SCREEN_ID_STEPS } from '../../constants/accept-screen-id-steps';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';

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

export const mapUserToAcceptScreenSeller: ToDomainMapper<User, AcceptScreenSeller> = (seller: User): AcceptScreenSeller => {
  // TODO: Map address when request created		Date: 2022/01/20
  return {
    id: seller.id,
    imageUrl: mapUserToImageUrl(seller),
    address: null,
  };
};

export const mapUserToAcceptScreenBuyer: ToDomainMapper<User, AcceptScreenBuyer> = (buyer: User): AcceptScreenBuyer => {
  return {
    id: buyer.id,
    imageUrl: mapUserToImageUrl(buyer),
    name: buyer.microName,
  };
};

export const mapCarrierDropOffModeToAcceptScreenCarriers: ToDomainMapper<CarrierDropOffModeRequest, AcceptScreenCarrier[]> = (
  input: CarrierDropOffModeRequest
): AcceptScreenCarrier[] => {
  return input.modes.map((dropOffModeRequest: DropOffModeRequest) => {
    if (dropOffModeRequest.type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP) {
      return mapHomePickup(dropOffModeRequest);
    }
    return mapDropOffPoint(dropOffModeRequest);
  });
};

export const mapDeliveryAddresstoAcceptScreenDeliveryAddress: ToDomainMapper<DeliveryAddressApi, AcceptScreenDeliveryAddress> = (
  input: DeliveryAddressApi
): AcceptScreenDeliveryAddress => {
  const flatAndFloor: string = input.flat_and_floor ? ` ${input.flat_and_floor},` : '';
  return {
    fullAddress: `${input.street},${flatAndFloor} ${input.postal_code}, ${input.city}`,
  };
};

const mapDropOffPoint: ToDomainMapper<DropOffModeRequest, AcceptScreenDropOffPoint> = (
  dropOffMode: DropOffModeRequest
): AcceptScreenDropOffPoint => {
  const lastAddressUsed: LastAddressUsed = dropOffMode.postOfficeDetails.lastAddressUsed;
  return {
    ...mapCarrier(dropOffMode),
    dropOffPoint: lastAddressUsed ? mapDropOffPointInformation(lastAddressUsed) : null,
  };
};

const mapHomePickup: ToDomainMapper<DropOffModeRequest, AcceptScreenHomePickUp> = (
  dropOffMode: DropOffModeRequest
): AcceptScreenHomePickUp => {
  return {
    ...mapCarrier(dropOffMode),
    deliveryDayInformation: dropOffMode.schedule ? mapDeliveryDayInformation(dropOffMode.schedule) : null,
  };
};

const mapCarrier: ToDomainMapper<DropOffModeRequest, AcceptScreenCarrier> = (dropOffMode: DropOffModeRequest): AcceptScreenCarrier => {
  return {
    type: dropOffMode.type,
    isSelected: null,
    icon: dropOffMode.icon,
    title: mapTitle(dropOffMode.type),
    price: mapPrice(dropOffMode.sellerCosts),
    information: mapInformation(dropOffMode.type),
    secondaryInformation: mapSecondaryInformation(dropOffMode.type),
    restrictions: dropOffMode.restrictions,
    buttonProperties: mapButtonProperties(
      dropOffMode.type,
      dropOffMode.schedule?.isEditable,
      dropOffMode.postOfficeDetails?.selectionRequired
    ),
    acceptEndpoint: dropOffMode.acceptEndpoint,
  };
};

const mapUserToImageUrl: ToDomainMapper<User, string> = (user: User): string => {
  return user.image?.urls_by_size.original || PLACEHOLDER_AVATAR;
};

const mapTitle: ToDomainMapper<CARRIER_DROP_OFF_MODE, string> = (type: CARRIER_DROP_OFF_MODE): string => {
  return AcceptScreenDropOffPointTitle[type];
};

const mapInformation: ToDomainMapper<CARRIER_DROP_OFF_MODE, string> = (type: CARRIER_DROP_OFF_MODE): string => {
  return AcceptScreenDropOffPointInformation[type];
};

function mapSecondaryInformation(type: CARRIER_DROP_OFF_MODE): string {
  return AcceptScreenDropOffPointSecondInformation[type];
}

function mapButtonProperties(
  type: CARRIER_DROP_OFF_MODE,
  isScheduleEditable: boolean,
  isPostOfficeEditable: boolean
): AcceptScreenCarrierButtonProperties {
  const redirectStep: ACCEPT_SCREEN_ID_STEPS =
    type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? ACCEPT_SCREEN_ID_STEPS.SCHEDULE : ACCEPT_SCREEN_ID_STEPS.MAP;
  const isShowed: boolean = type === CARRIER_DROP_OFF_MODE.HOME_PICK_UP ? isScheduleEditable : isPostOfficeEditable;

  return {
    isShowed,
    text: AcceptScreenDropOffPointButtonTranslations[type],
    redirectStep,
  };
}

const mapPrice: ToDomainMapper<Money, string> = (sellerCosts: Money): string => {
  return sellerCosts.amount.total <= 0 ? 'GRATIS' : sellerCosts.toString();
};

const mapDropOffPointInformation: ToDomainMapper<LastAddressUsed, string> = (lastAddressUsed: LastAddressUsed): string => {
  if (lastAddressUsed.deliveryMode === DELIVERY_MODE.BUYER_ADDRESS && lastAddressUsed.buyerAddress) {
    const flatAndFloor: string = lastAddressUsed.buyerAddress.flatAndFloor;
    const checkedFloor: string = flatAndFloor ? ` ${flatAndFloor}` : '';

    return `${capitalizeFirstLetter(lastAddressUsed.buyerAddress.street)}${checkedFloor}, ${
      lastAddressUsed.buyerAddress.postalCode
    } ${capitalizeFirstLetter(lastAddressUsed.buyerAddress.city)}`;
  }

  if (lastAddressUsed.deliveryMode === DELIVERY_MODE.CARRIER_OFFICE && lastAddressUsed.officeAddress) {
    return `${capitalizeFirstLetter(lastAddressUsed.officeAddress.street)}, ${
      lastAddressUsed.officeAddress.postalCode
    } ${capitalizeFirstLetter(lastAddressUsed.officeAddress.city)}`;
  }
};

const mapDeliveryDayInformation: ToDomainMapper<TentativeSchedule, string> = (schedule: TentativeSchedule): string => {
  const weekDay: string = schedule.pickUpStartDate.toLocaleDateString(navigatorLanguage, { weekday: 'long' }).toLowerCase();
  const completeDate: string = schedule.pickUpStartDate
    .toLocaleDateString(navigatorLanguage, { day: 'numeric', month: 'long', year: 'numeric' })
    .toLowerCase();
  const hourStart: string = getHourAndMinutesFromDate(schedule.pickUpStartDate);
  const hourEnd: string = getHourAndMinutesFromDate(schedule.pickUpEndDate);

  return `${weekDay}, ${completeDate}, ${hourStart} - ${hourEnd}.`;
};

const getHourAndMinutesFromDate: ToDomainMapper<Date, string> = (date: Date): string => {
  return date.toLocaleTimeString(navigatorLanguage, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const capitalizeFirstLetter: ToDomainMapper<string, string> = (text: string): string => {
  const lowerCaseText: string = text.toLowerCase();
  return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);
};
