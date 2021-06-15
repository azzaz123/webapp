import { environment } from '@environments/environment.beta';

export const DELIVERY_CREDIT_CARDS_ENDPOINT = `${environment.baseUrl}/api/v3/payments/cards`;
export const DELIVERY_CREDIT_CARDS_TOKENIZER_ENDPOINT = `${DELIVERY_CREDIT_CARDS_ENDPOINT}/tokenizer/information`;
