import { DeliveryBuyerAddressUsedDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-address-used-dto.interface';
import { DeliveryBuyerDeliveryTimeDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-delivery-time-dto.interface';

export interface DeliveryBuyerDeliveryMethodDto {
  carrier: DeliveryBuyerCarrierDto;
  delivery_times: DeliveryBuyerDeliveryTimeDto;
  icon: string;
  last_address_used: DeliveryBuyerAddressUsedDto;
  method: DeliveryBuyerDeliveryModeDto;
}

export type DeliveryBuyerDeliveryModeDto = 'BUYER_ADDRESS' | 'CARRIER_OFFICE';
export type DeliveryBuyerCarrierDto = 'SEUR' | 'POSTE_ITALIANE' | 'correos';
