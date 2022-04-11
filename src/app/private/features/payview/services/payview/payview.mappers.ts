import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapToDeliveryAddress: ToDomainMapper<DeliveryAddressApi, DeliveryAddress> = (input: DeliveryAddressApi) => {
  if (!input) {
    return null;
  }
  const {
    city,
    country_iso_code: country,
    full_name: fullName,
    flat_and_floor: flatAndFloor,
    id,
    phone_number: phoneNumber,
    postal_code: postalCode,
    region,
    street,
  } = input;

  return {
    city,
    country,
    flatAndFloor,
    fullName,
    id,
    phoneNumber,
    postalCode,
    region,
    street,
  };
};
