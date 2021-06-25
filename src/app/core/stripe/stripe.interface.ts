export enum STRIPE_ERROR {
  card_declined = 'card_declined',
  expired_card = 'expired_card',
  incorrect_cvc = 'incorrect_cvc',
  unknown = 'unknown',
}

export interface PaymentError {
  error_code: STRIPE_ERROR | string;
  message: string;
}
