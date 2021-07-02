import { MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE } from '@api/fixtures/payments/cards/mangopay-card-registration-errors.fixtures.spec';
import { MangopayCardRegistrationErrorResponseMapped } from '../../dtos/errors/mangopay-card-registration-error-response-api';
import { mapMangopayCardRegistrationErrorResponse } from './mangopay-card-registration-error-response.mapper';

describe('mapMangopayCardRegistrationErrorResponse', () => {
  describe('when mapping Mangopay card registration invalid response', () => {
    it('should map to network error', () => {
      const mappedError = mapMangopayCardRegistrationErrorResponse(MOCK_INVALID_CARD_NUMBER_CARD_TOKENIZER_ERROR_RESPONSE);
      expect(mappedError instanceof MangopayCardRegistrationErrorResponseMapped).toBe(true);
    });
  });
});
