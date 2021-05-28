import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export interface DeliveryAddressFormErrorMessages {
  phone_number: string;
  postal_code: string;
  street: string;
  flat_and_floor: string;
}

export enum DELIVERY_ADDRESS_ERROR {
  'invalid phone number' = 'invalid phone number',
  'invalid postal code' = 'invalid postal code',
  'postal code is not allowed' = 'postal code is not allowed',
  'delivery address too long' = 'delivery address too long',
  'flat and floor too long' = 'flat and floor too long',
  'postal code not exists' = 'postal code not exists',
  'invalid mobile phone number' = 'invalid mobile phone number',
}

export interface DeliveryAddressErrorApi {
  error_code: DELIVERY_ADDRESS_ERROR | string;
  message: string;
}

export interface DeliveryAddressErrorSpecification {
  error_code: DELIVERY_ADDRESS_ERROR;
  name: string;
  formControlName: string;
  translationKey: TRANSLATION_KEY;
}

export const DeliveryAddressErrorsSpecifications: DeliveryAddressErrorSpecification[] = [
  {
    error_code: DELIVERY_ADDRESS_ERROR['invalid phone number'],
    name: 'invalidPhoneNumber',
    formControlName: 'phone_number',
    translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_NUMBER_INVALID_ERROR,
  },
  {
    error_code: DELIVERY_ADDRESS_ERROR['delivery address too long'],
    name: 'addressTooLong',
    formControlName: 'street',
    translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_TOO_LONG_HINT_ERROR,
  },
  {
    error_code: DELIVERY_ADDRESS_ERROR['flat and floor too long'],
    name: 'flatAndFloorTooLong',
    formControlName: 'flat_and_floor',
    translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_TOO_LONG_HINT_ERROR,
  },
  {
    error_code: DELIVERY_ADDRESS_ERROR['invalid mobile phone number'],
    name: 'missmatchLocationPhoneNumber',
    formControlName: 'phone_number',
    translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_MISSMATCH_LOCATION_ERROR,
  },
];
