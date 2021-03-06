import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import {
  LastAddressUsed,
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
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { ToDomainMapper } from '@api/core/utils/types';

const carriers: Record<DeliveryBuyerCarrierDto, POST_OFFICE_CARRIER> = {
  correos: POST_OFFICE_CARRIER.CORREOS,
  POSTE_ITALIANE: POST_OFFICE_CARRIER.POSTE_ITALIANE,
  SEUR: POST_OFFICE_CARRIER.SEUR,
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

  const methods: DeliveryBuyerDeliveryMethod[] = deliveryMethods.length ? deliveryMethods.map(mapToDeliveryMethod) : [];

  return {
    addressLabel: methods.length ? mapToAddressLabel(methods) : null,
    current: methods.length ? methods[defaultMethod.index] : null,
    deliveryMethods: methods,
    default: defaultMethod,
  };
};

const mapToAddressLabel: ToDomainMapper<DeliveryBuyerDeliveryMethod[], string> = (input: DeliveryBuyerDeliveryMethod[]): string => {
  return input.find((method: DeliveryBuyerDeliveryMethod) => method.method === DELIVERY_MODE.BUYER_ADDRESS).lastAddressUsed?.label || null;
};

const mapToDeliveryMethod: ToDomainMapper<DeliveryBuyerDeliveryMethodDto, DeliveryBuyerDeliveryMethod> = (
  input: DeliveryBuyerDeliveryMethodDto
): DeliveryBuyerDeliveryMethod => {
  const { carrier, delivery_times: deliveryTimes, icon, last_address_used: lastAddressUsed, method } = input;
  return {
    carrier: carriers[carrier] ?? null,
    deliveryTimes: deliveryTimes as DeliveryBuyerDeliveryTime,
    icon: icon,
    lastAddressUsed: lastAddressUsed as LastAddressUsed,
    method: methods[method] ?? null,
  };
};
