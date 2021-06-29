export enum PAYMENTS_CARDS_ERROR_CODES {
  CARD_COUNTRY_IS_INVALID = 'invalid card country',
  CARD_IS_NOT_AUTHORIZED = 'unauthorized card',
  CARD_NOT_FOUND = 'card not found',
  CARD_OWNER_IS_INVALID = 'invalid card owner',
  CARD_OWNER_NAME_IS_INVALID = 'invalid card owner name',
  CARD_REGISTRATION_FAILED = 'card registration failed',
  CARD_REGISTRATION_IS_INVALID = 'invalid card registration',
  CARD_TOKENIZATION_FAILED = 'card tokenization failed',
  COUNTRY_ISO_CODE_IS_INVALID = 'invalid country ISO code',
  PLATFORM_RESPONSE_IS_INVALID = 'invalid platform response',
  UNIQUE_CARD_FOR_USER = 'unique card for user violated',
}
