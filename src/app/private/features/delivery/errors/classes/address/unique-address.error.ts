import { DeliveryAddressError } from './delivery-address.error';

export class UniqueAddressByUserError extends DeliveryAddressError {
  constructor(messageFromBackend: string) {
    super(messageFromBackend);
  }
}
