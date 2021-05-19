import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DeliveryAddressErrorsSpecifications } from '../../interfaces/delivery-address/delivery-address-error.interface';
export const INVALID_DELIVERY_ADDRESS_CODE = 409;
export const INVALID_DELIVERY_ADDRESS_POSTAL_CODE = 500;

export class DeliveryAddressError extends Error {
  translationKey: TRANSLATION_KEY;
  formControlName: string;

  constructor(public message: string) {
    super(message);

    const error = DeliveryAddressErrorsSpecifications[message]();
    this.name = error.name;
    this.formControlName = error.formControlName;
    this.translationKey = error.translationKey;
  }
}
