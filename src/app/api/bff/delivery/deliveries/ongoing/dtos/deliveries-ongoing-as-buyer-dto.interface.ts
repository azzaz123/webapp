import { DeliveryOngoingBuyerStatusDto } from './delivery-ongoing-status-dto.type';

export interface DeliveriesOngoingAsBuyerDto {
  ongoing_deliveries: OngoingDeliveryAsBuyerDto[];
}

interface OngoingDeliveryAsBuyerDto {
  buyer: {
    hash: string;
    image: string;
    name: string;
  };
  item: {
    cost: {
      amount: number;
      currency: string;
    };
    hash: string;
    image: string;
    name: string;
  };
  request_id: string;
  seller: {
    hash: string;
    image: string;
    name: string;
  };
  status: DeliveryOngoingBuyerStatusDto;
}
