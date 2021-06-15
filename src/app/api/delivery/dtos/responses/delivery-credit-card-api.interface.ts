export enum DELIVERY_CREDIT_CARD_STATUS_API_ENUM {
  PENDING_3DS = 'PENDING_3DS',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export interface DeliveryCreditCardApi {
  card_holder_name: string;
  country: string;
  expiration_date: string;
  id: string;
  number_alias: string;
  status: DELIVERY_CREDIT_CARD_STATUS_API_ENUM;
}
