import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { BuyerRequestBuyDto, DeliveryModeDto } from '../../../dtos/buyer-request-buy-dto.interface';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';

export const mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties = (input: PayviewState): BuyerRequestBuyDto => {
  const { item, delivery, costs, buyerRequestId: id } = input;

  return {
    id,
    item_hash: item.id,
    seller_user_hash: item.owner,
    offered_price: {
      amount: item.salePrice,
      currency: item.currencyCode,
    },
    ...(costs.promotion?.promocode && { promocode: costs.promotion.promocode }),
    carrier_delivery_mode: deliveryModeToDtoConverter[delivery.methods.current.method],
  };
};

const deliveryModeToDtoConverter: Record<DELIVERY_MODE, DeliveryModeDto> = {
  [DELIVERY_MODE.BUYER_ADDRESS]: 'BUYER_ADDRESS',
  [DELIVERY_MODE.CARRIER_OFFICE]: 'CARRIER_OFFICE',
};
