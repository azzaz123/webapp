import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { BuyerRequestsItemsDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-requests-items-details-dto.interface';
import { mapAmountAndCurrenyToMoney } from '@api/core/mappers';
import { PriceDto } from '@api/core/dtos';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails: ToDomainMapper<
  BuyerRequestsItemsDetailsDto,
  BuyerRequestsItemsDetails
> = (input: BuyerRequestsItemsDetailsDto) => {
  const {
    category_id: categoryId,
    item_hash: itemHash,
    picture_url: pictureUrl,
    price,
    seller_country: sellerCountry,
    seller_user_hash: sellerUserHash,
    title,
  } = input;

  return {
    categoryId,
    itemHash,
    pictureUrl,
    price: mapAmountAndCurrenyToMoney<PriceDto>(price),
    sellerCountry,
    sellerUserHash,
    title,
  };
};
