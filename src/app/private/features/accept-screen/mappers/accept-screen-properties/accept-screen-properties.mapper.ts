import { ToDomainMapper } from '@api/core/utils/types/to-domain-mapper.type';
import { Item } from '@core/item/item';
import { User, PLACEHOLDER_AVATAR } from '@core/user/user';
import { mapNumberAndCurrencyCodeToMoney, NumberCurrencyCode } from '@api/core/mappers/money/money-mapper';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { AcceptScreenItem, AcceptScreenSeller, AcceptScreenBuyer } from '@private/features/accept-screen/interfaces';
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

const mapUserToImageUrl: ToDomainMapper<User, string> = (user: User): string => {
  return user.image?.urls_by_size.original || PLACEHOLDER_AVATAR;
};
