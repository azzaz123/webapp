import {
  CardCountryIsInvalidError,
  CardCvvIsInvalidError,
  CardExpirationDateIsInvalidError,
  CardIsNotAuthorizedError,
  CardNotFoundError,
  CardNumberIsInvalidError,
  CardOwnerIsInvalidError,
  CardOwnerNameIsInvalidError,
  CardRegistrationFailedError,
  CardRegistrationIsInvalidError,
  CardTokenizationFailedError,
  CountryIsoCodeIsInvalidError,
  PaymentsCardsError,
  PlatformResponseIsInvalidError,
  UniqueCardForUserError,
} from '@api/core/errors/payments/cards';
import {
  MOCK_CARD_EXPIRED_CARD_REGISTRATION_ERROR_RESPONSE,
  MOCK_CARD_EXPIRED_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
  MOCK_CARD_NOT_ACTIVE_CARD_REGISTRATION_ERROR_RESPONSE,
  MOCK_CARD_NOT_ACTIVE_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
  MOCK_INVALID_CARD_NUMBER_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
  MOCK_INVALID_CVV_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
  MOCK_INVALID_DATE_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
  MOCK_UNKNOWN_OR_UNMAPPED_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED,
} from '@api/fixtures/payments/cards/mangopay-card-registration-errors.fixtures.spec';
import {
  MOCK_PAYMENTS_CARDS_ERROR_CARD_COUNTRY_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_IS_NOT_AUTHORIZED_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_NOT_FOUND_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_FAILED_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_CARD_TOKENIZATION_FAILED_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_COUNTRY_ISO_CODE_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_PLATFORM_RESPONSE_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_ERROR_UNIQUE_CARD_FOR_USER_RESPONSE,
} from '@api/fixtures/payments/cards/payments-cards-errors.fixtures.spec';
import { PaymentsCardsErrorMapper } from './payments-cards-error-mapper';

const paymentsCardsErrorMapper = new PaymentsCardsErrorMapper();

describe('PaymentsCardsErrorMapper', () => {
  it('should create the mapper', () => {
    expect(paymentsCardsErrorMapper).toBeTruthy();
  });

  describe('when mapping an error from payments cards server', () => {
    describe('and server notifies card country is invalid', () => {
      it('should notify card country is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_COUNTRY_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardCountryIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies card is not authorized', () => {
      it('should notify card is not authorized', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_IS_NOT_AUTHORIZED_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardIsNotAuthorizedError).toBe(true);
      });
    });

    describe('and server notifies card was not found', () => {
      it('should notify card was not found', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_NOT_FOUND_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardNotFoundError).toBe(true);
      });
    });

    describe('and server notifies card owner is invalid', () => {
      it('should notify card owner is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardOwnerIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies card owner name is invalid', () => {
      it('should notify card owner name is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardOwnerNameIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies card registration failed', () => {
      it('should notify card registration failed', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_FAILED_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardRegistrationFailedError).toBe(true);
      });
    });

    describe('and server notifies card registration is invalid', () => {
      it('should notify card registration is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_REGISTRATION_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardRegistrationIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies card tokenization failed', () => {
      it('should notify card tokenization failed', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_CARD_TOKENIZATION_FAILED_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardTokenizationFailedError).toBe(true);
      });
    });

    describe('and server notifies country ISO code is invalid', () => {
      it('should notify country ISO code is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_COUNTRY_ISO_CODE_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CountryIsoCodeIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies platform response is invalid', () => {
      it('should notify platform response is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_PLATFORM_RESPONSE_IS_INVALID_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof PlatformResponseIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies unique card for user', () => {
      it('should notify unique card for user', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_PAYMENTS_CARDS_ERROR_UNIQUE_CARD_FOR_USER_RESPONSE).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof UniqueCardForUserError).toBe(true);
      });
    });
  });

  describe('when mapping an error from Mangopay card registration server', () => {
    describe('and server notifies card expired', () => {
      it('should notify card expiration date is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_CARD_EXPIRED_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardExpirationDateIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies card is not active', () => {
      it('should notify card registration is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_CARD_NOT_ACTIVE_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardRegistrationIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies invalid card number', () => {
      it('should notify card number is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_INVALID_CARD_NUMBER_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardNumberIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies invalid card CVV', () => {
      it('should notify card CVV is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_INVALID_CVV_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardCvvIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies invalid date', () => {
      it('should notify card expiration date is invalid', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_INVALID_DATE_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardExpirationDateIsInvalidError).toBe(true);
      });
    });

    describe('and server notifies an unknown or unmapped error', () => {
      it('should notify card tokenization failed', () => {
        let result: PaymentsCardsError;

        paymentsCardsErrorMapper.map(MOCK_UNKNOWN_OR_UNMAPPED_CARD_REGISTRATION_ERROR_RESPONSE_MAPPED).subscribe({
          error: (errors) => (result = errors[0]),
        });

        expect(result instanceof CardTokenizationFailedError).toBe(true);
      });
    });
  });
});
