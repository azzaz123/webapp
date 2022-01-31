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
} from '@private/features/accept-screen/interfaces';
import { CarrierDropOffModeRequest, DropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { FALLBACK_NOT_FOUND_SRC } from '@private/core/constants/fallback-images-src-constants';

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
    fullAddress: mapDeliveryAddressToSellerAddress(address),
  };
}

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

const mapDeliveryAddressToSellerAddress: ToDomainMapper<DeliveryAddressApi, string> = (input: DeliveryAddressApi): string => {
  const flatAndFloor: string = input.flat_and_floor ? ` ${input.flat_and_floor},` : '';
  return `${input.street},${flatAndFloor} ${input.postal_code}, ${input.city}`;
};

const mapDropOffPoint: ToDomainMapper<DropOffModeRequest, AcceptScreenDropOffPoint> = (
  dropOffMode: DropOffModeRequest
): AcceptScreenDropOffPoint => {
  // TODO: Map Selected Office when we know logic		Date: 2022/01/25
  return {
    ...mapCarrier(dropOffMode),
    selectedOffice: null,
    postOfficeDetails: dropOffMode.postOfficeDetails,
  };
};

const mapHomePickup: ToDomainMapper<DropOffModeRequest, AcceptScreenHomePickUp> = (
  dropOffMode: DropOffModeRequest
): AcceptScreenHomePickUp => {
  return {
    ...mapCarrier(dropOffMode),
    schedule: dropOffMode.schedule,
  };
};

const mapCarrier: ToDomainMapper<DropOffModeRequest, AcceptScreenCarrier> = (dropOffMode: DropOffModeRequest): AcceptScreenCarrier => {
  // TODO: Map Is Selected when we know logic		Date: 2022/01/25
  return {
    type: dropOffMode.type,
    icon: dropOffMode.icon,
    isSelected: null,
    cost: dropOffMode.sellerCosts,
    acceptEndpoint: dropOffMode.acceptEndpoint,
    restrictions: dropOffMode.restrictions,
  };
};

const mapUserToImageUrl: ToDomainMapper<User, string> = (user: User): string => {
  return user.image?.urls_by_size.original || PLACEHOLDER_AVATAR;
};
