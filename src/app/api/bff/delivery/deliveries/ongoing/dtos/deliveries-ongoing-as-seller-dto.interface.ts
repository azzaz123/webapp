import { DeliveryOngoingStatusDto } from './delivery-ongoing-status-dto.type';

export interface DeliveriesOngoingAsSellerDto {
  ongoing_deliveries: OngoingDeliveryAsSellerDto[];
}

interface OngoingDeliveryAsSellerDto {
  buyer: {
    hash: string;
    image: string;
    name: string;
  };
  item: {
    cost: {
      amount: 0;
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
  status: DeliveryOngoingStatusDto;
}
