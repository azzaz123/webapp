import {
  MangopayCardRegistrationErrorResponseApi,
  MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX,
} from '@api/payments/cards/dtos/errors/payments-cards-error-response-api.interface';
import { MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM } from '@api/payments/cards/mappers/errors/mangopay-card-registration-error-codes.enum';

export const MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE: MangopayCardRegistrationErrorResponseApi = `${MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX}=${MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.INVALID_CARD_NUMBER}`;
