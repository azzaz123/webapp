import { DeliveryBuyerAddressUsedDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-address-used-dto.interface';
import { DeliveryBuyerDeliveryTimeDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-delivery-time-dto.interface';

export interface DeliveryBuyerDeliveryMethodDto {
  carrier: CarrierDto;
  delivery_times: DeliveryBuyerDeliveryTimeDto;
  icon: string;
  last_address_used: DeliveryBuyerAddressUsedDto;
  method: DeliveryModeDto;
}

export type DeliveryModeDto = 'BUYER_ADDRESS' | 'CARRIER_OFFICE';
export type CarrierDto = 'SEUR' | 'POSTE_ITALIANE' | 'correos';
