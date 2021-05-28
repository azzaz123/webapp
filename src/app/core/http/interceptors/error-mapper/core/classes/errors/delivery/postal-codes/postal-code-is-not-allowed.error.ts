import { DeliveryPostalCodesError } from '.';

export class PostalCodeIsNotAllowed extends DeliveryPostalCodesError {
  constructor(public error_code: 'postal code is not allowed', public message: string) {
    super(error_code, message);
  }
}
