import { DeliveryPostalCodesError } from '.';

export class InvalidPostalCode extends DeliveryPostalCodesError {
  constructor(public error_code: 'invalid postal code', public message: string) {
    super(error_code, message);
  }
}
