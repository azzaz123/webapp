export type PaymentsCreditCardStatusApi = 'PENDING_3DS' | 'VALID' | 'INVALID';

export interface PaymentsCreditCardApi {
  card_holder_name: string;
  country: string;
  expiration_date: string;
  id: string;
  number_alias: string;
  status: PaymentsCreditCardStatusApi;
}
