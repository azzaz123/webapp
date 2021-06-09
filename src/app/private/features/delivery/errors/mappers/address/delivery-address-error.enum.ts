export enum DELIVERY_ADDRESS_ERROR_CODES {
  INVALID_PHONE_NUMBER = 'invalid phone number',
  INVALID_MOBILE_PHONE_NUMBER = 'invalid mobile phone number',
  INVALID_POSTAL_CODE = 'invalid postal code',
  POSTAL_CODE_IS_NOT_ALLOWED = 'postal code is not allowed',
  POSTAL_CODE_DOES_NOT_EXIST = 'postal code not exists',
  DELIVERY_ADDRESS_TOO_LONG = 'delivery address too long',
  FLAT_AND_FLOOR_TOO_LONG = 'flat and floor too long',
  UNIQUE_ADDRESS_BY_USER = 'unique address by user violated',
}
