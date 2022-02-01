import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import {
  DeliveryBuyerAddressUsed,
  DeliveryBuyerCarrier,
  DeliveryBuyerDefaultDeliveryMethod,
  DeliveryBuyerDeliveryMethod,
  DeliveryBuyerDeliveryMethods,
  DeliveryBuyerDeliveryTime,
} from '@api/core/model/delivery/buyer/delivery-methods';
import {
  DeliveryBuyerCarrierDto,
  DeliveryBuyerDeliveryMethodDto,
  DeliveryBuyerDeliveryMethodsDto,
  DeliveryBuyerDeliveryModeDto,
} from '@api/bff/delivery/buyer/dtos';
import { ToDomainMapper } from '@api/core/utils/types';

const carriers: Record<DeliveryBuyerCarrierDto, DeliveryBuyerCarrier> = {
  correos: DeliveryBuyerCarrier.CORREOS,
  POSTE_ITALIANE: DeliveryBuyerCarrier.POSTE_ITALIANE,
  SEUR: DeliveryBuyerCarrier.SEUR,
};

const methods: Record<DeliveryBuyerDeliveryModeDto, DELIVERY_MODE> = {
  BUYER_ADDRESS: DELIVERY_MODE.BUYER_ADDRESS,
  CARRIER_OFFICE: DELIVERY_MODE.CARRIER_OFFICE,
};

export const mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods: ToDomainMapper<
  DeliveryBuyerDeliveryMethodsDto,
  DeliveryBuyerDeliveryMethods
> = (input: DeliveryBuyerDeliveryMethodsDto): DeliveryBuyerDeliveryMethods => {
  const { delivery_methods: deliveryMethods, default: defaultMethod } = input;

  const methods: DeliveryBuyerDeliveryMethod[] = [];
  deliveryMethods.forEach((method: DeliveryBuyerDeliveryMethodDto) => {
    methods.push(mapToDeliveryMethod(method));
  });

  return {
    deliveryMethods: methods,
    default: defaultMethod as DeliveryBuyerDefaultDeliveryMethod,
  };
};

const mapToDeliveryMethod: ToDomainMapper<DeliveryBuyerDeliveryMethodDto, DeliveryBuyerDeliveryMethod> = (
  input: DeliveryBuyerDeliveryMethodDto
): DeliveryBuyerDeliveryMethod => {
  const { carrier, delivery_times: deliveryTimes, icon, last_address_used: lastAddressUsed, method } = input;
  return {
    carrier: carriers[carrier] ?? null,
    deliveryTimes: deliveryTimes as DeliveryBuyerDeliveryTime,
    icon: icon,
    lastAddressUsed: lastAddressUsed as DeliveryBuyerAddressUsed,
    method: methods[method] ?? null,
  };
};
