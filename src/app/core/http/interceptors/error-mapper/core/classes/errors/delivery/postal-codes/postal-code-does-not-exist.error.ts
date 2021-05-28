import { DeliveryPostalCodesError } from '.';

export class PostalCodeDoesNotExist extends DeliveryPostalCodesError {
  constructor(public error_code: 'postal code not exists', public message: string) {
    super(error_code, message);
  }
}
