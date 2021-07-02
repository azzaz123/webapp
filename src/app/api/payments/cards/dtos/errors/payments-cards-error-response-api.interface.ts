import { PaymentsErrorResponseApi } from '@api/payments/dtos/errors';
import { PAYMENTS_CARDS_ERROR_CODES } from '@api/payments/cards/mappers/errors/payments-cards-error-codes.enum';

export type PaymentsCardsErrorResponseApi = PaymentsErrorResponseApi<PAYMENTS_CARDS_ERROR_CODES>;
