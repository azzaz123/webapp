import { DELIVERY_CREDIT_CARD_STATUS_API_ENUM } from '@private/features/delivery/enums/delivery-credit-card-status-enum-api.interface';

export interface DeliveryCreditCardApi {
  card_holder_name: string;
  country: string;
  expiration_date: string;
  id: string;
  number_alias: string;
  status: DELIVERY_CREDIT_CARD_STATUS_API_ENUM;
}
