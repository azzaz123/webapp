import { DeliveryOngoingSellerStatusDto } from './delivery-ongoing-status-dto.type';

export interface DeliveriesOngoingAsSellerDto {
  ongoing_deliveries: OngoingDeliveryAsSellerDto[];
}

export interface OngoingDeliveryAsSellerDto {
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
  status: DeliveryOngoingSellerStatusDto;
}
