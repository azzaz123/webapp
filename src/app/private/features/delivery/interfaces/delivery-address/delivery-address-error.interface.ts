import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

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

// type DeliveryAddressErrorSpecification = () => {
//   name: string;
//   formControlName: string;
//   translationKey: TRANSLATION_KEY;
// };

export interface DeliveryAddressErrorSpecification {
  name: string;
  formControlName: string;
  translationKey: TRANSLATION_KEY;
}

// TODO: this needs to be typed (return)		Date: 2021/05/19

export const DeliveryAddressErrorsSpecifications = {
  'invalid phone number': () => {
    return {
      name: 'invalidPhoneNumber',
      formControlName: 'phone_number',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_NUMBER_INVALID_ERROR,
    };
  },
  'invalid postal code': () => {
    return {
      name: 'invalidPostalCode',
      formControlName: 'postal_code',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_INVALID_ERROR,
    };
  },
  'postal code is not allowed': () => {
    return {
      name: 'postalCodeNotAllowed',
      formControlName: 'postal_code',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_ALLOWED_ERROR,
    };
  },
  'delivery address too long': () => {
    return {
      name: 'addressTooLong',
      formControlName: 'street',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_TOO_LONG_HINT_ERROR,
    };
  },
  'flat and floor too long': () => {
    return {
      name: 'flatAndFloorTooLong',
      formControlName: 'flat_and_floor',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_TOO_LONG_HINT_ERROR,
    };
  },
  'postal code not exists': () => {
    return {
      name: 'postalCodeNotExists',
      formControlName: 'postal_code',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_EXISTS_ERROR,
    };
  },
  'invalid mobile phone number': () => {
    return {
      name: 'missmatchLocationPhoneNumber',
      formControlName: 'phone_number',
      translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_MISSMATCH_LOCATION_ERROR,
    };
  },
};
