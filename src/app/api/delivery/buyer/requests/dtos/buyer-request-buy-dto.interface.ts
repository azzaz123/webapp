export interface BuyerRequestBuyDto {
  id: string;
  item_hash: string;
  seller_user_hash: string;
  offered_price: {
    amount: number;
    currency: string;
  };
  promocode?: string;
  carrier_delivery_mode: DeliveryModeDto;
}

export type DeliveryModeDto = 'BUYER_ADDRESS' | 'CARRIER_OFFICE';
