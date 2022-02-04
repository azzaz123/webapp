import { DeliveryBuyerDefaultDeliveryMethodDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-default-delivery-method-dto.interface';
import { DeliveryBuyerDeliveryMethodDto } from '@api/bff/delivery/buyer/dtos/delivery-buyer-delivery-method-dto.interface';

export interface DeliveryBuyerDeliveryMethodsDto {
  delivery_methods: DeliveryBuyerDeliveryMethodDto[];
  default: DeliveryBuyerDefaultDeliveryMethodDto;
}
