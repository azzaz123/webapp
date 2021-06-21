import { DeliveryPostalCodesError } from './delivery-postal-codes.error';

export class PostalCodeIsNotAllowedError extends DeliveryPostalCodesError {
  constructor(messageFromBackend: string) {
    super(messageFromBackend);
  }
}
