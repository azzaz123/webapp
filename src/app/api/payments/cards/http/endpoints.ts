import { environment } from '@environments/environment';

export const PAYMENTS_CREDIT_CARDS_ENDPOINT = `${environment.baseUrl}api/v3/payments/cards`;
export const PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT = `${PAYMENTS_CREDIT_CARDS_ENDPOINT}/tokenizer/information`;
