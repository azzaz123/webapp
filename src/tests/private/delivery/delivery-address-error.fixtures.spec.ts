import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import {
  MappedAddressError,
  ADDRESS_ERROR_TYPE,
} from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_PHONE_NUMBER = {
  error_code: 'invalid phone number',
  message: 'Phone number 083729100000029 is invalid.',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_POSTAL_CODE = {
  error_code: 'invalid postal code',
  message: 'Postal code 00000 is invalid.',
};

export const MOCK_DELIVERY_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER = {
  error_code: 'invalid mobile phone number',
  message: 'Mobile phone number 083729100000029 is invalid.',
};

export const MOCK_MAPPED_ADDRESS_ERROR_INVALID_PHONE_NUMBER: MappedAddressError = {
  translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_NUMBER_INVALID_ERROR,
  translation: '',
  formControlName: 'phone_number',
  type: ADDRESS_ERROR_TYPE.TOAST,
};

export const MOCK_MAPPED_ADDRESS_ERROR_INVALID_POSTAL_CODE: MappedAddressError = {
  translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_INVALID_ERROR,
  translation: '',
  formControlName: 'postal_code',
  type: ADDRESS_ERROR_TYPE.TOAST,
};

export const MOCK_MAPPED_ADDRESS_ERROR_INVALID_MOBILE_PHONE_NUMBER: MappedAddressError = {
  translationKey: TRANSLATION_KEY.DELIVERY_ADDRESS_PHONE_MISSMATCH_LOCATION_ERROR,
  translation: '',
  formControlName: 'phone_number',
  type: ADDRESS_ERROR_TYPE.FORM,
};
