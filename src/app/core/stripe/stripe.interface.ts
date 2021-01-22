export interface PaymentIntent {
  amount: number;
  canceled_at: number;
  cancellation_reason: string;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  description: string;
  id: string;
  last_payment_error: number;
  livemode: boolean;
  next_action: string;
  object: string;
  payment_method: string;
  payment_method_types: Array<string>;
  receipt_email: string;
  shipping: string;
  source: string;
  status: string;
}

export enum STRIPE_ERROR {
  card_declined = 'card_declined',
  expired_card = 'expired_card',
  incorrect_cvc = 'incorrect_cvc',
}

export interface PaymentError {
  error_code: STRIPE_ERROR | string;
  message: string;
}
