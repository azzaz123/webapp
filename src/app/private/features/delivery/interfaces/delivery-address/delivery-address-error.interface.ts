import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export enum ADDRESS_ERROR_TYPE {
  TOAST,
  FORM,
}

export interface DeliveryAddressFormErrorMessages {
  phone_number: string;
  postal_code: string;
  street: string;
  flat_and_floor: string;
}

export enum DELIVERY_ADDRESS_ERROR {
  'invalid phone number' = 'phoneNumberInvalid',
  'invalid postal code' = 'postalCodeInvalid',
  'postal code is not allowed' = 'postalCodeNotAllowed',
  'delivery address too long' = 'deliveryAddressTooLong',
  'flat and floor too long' = 'flatAndFloorTooLong',
  'postal code not exists' = 'postalCodeNotExists',
  'invalid mobile phone number' = 'phoneNumberMissmatchLocation',
}

export interface MappedAddressError {
  translationKey: TRANSLATION_KEY;
  type: ADDRESS_ERROR_TYPE;
  formControlName: string;
  translation: string;
}
