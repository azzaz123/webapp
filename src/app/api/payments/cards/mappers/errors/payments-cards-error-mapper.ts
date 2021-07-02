import {
  PaymentsCardsError,
  CardCountryIsInvalidError,
  CardIsNotAuthorizedError,
  CardOwnerIsInvalidError,
  CardOwnerNameIsInvalidError,
  CardRegistrationFailedError,
  CardRegistrationIsInvalidError,
  CardTokenizationFailedError,
  CountryIsoCodeIsInvalidError,
  PlatformResponseIsInvalidError,
  UniqueCardForUserError,
  CardNotFoundError,
  CardExpirationDateIsInvalidError,
  CardNumberIsInvalidError,
  CardCvvIsInvalidError,
} from '@api/core/errors/payments/cards';
import { ErrorMapper } from '@api/core/utils/classes';
import {
  MangopayCardRegistrationErrorResponseMapped,
  MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX,
} from '../../dtos/errors/mangopay-card-registration-error-response-api';
import { PaymentsCardsErrorResponseApi } from '../../dtos/errors/payments-cards-error-response-api.interface';
import { MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM } from './mangopay-card-registration-error-codes.enum';
import { PAYMENTS_CARDS_ERROR_CODES } from './payments-cards-error-codes.enum';

export class PaymentsCardsErrorMapper extends ErrorMapper<PaymentsCardsErrorResponseApi | MangopayCardRegistrationErrorResponseMapped> {
  protected generateErrorByRequest(
    networkError: PaymentsCardsErrorResponseApi | MangopayCardRegistrationErrorResponseMapped
  ): PaymentsCardsError[] {
    if (this.isMangopayCardRegistrationError(networkError)) {
      return [this.mapMangopayCardRegistrationErrorResponse(networkError)];
    }
    return this.mapPaymentsCardsErrorResponse(networkError);
  }

  private isMangopayCardRegistrationError(
    networkError: PaymentsCardsErrorResponseApi | MangopayCardRegistrationErrorResponseMapped
  ): networkError is MangopayCardRegistrationErrorResponseMapped {
    return networkError instanceof MangopayCardRegistrationErrorResponseMapped;
  }

  private mapPaymentsCardsErrorResponse(networkError: PaymentsCardsErrorResponseApi): PaymentsCardsError[] {
    const mappedErrors: PaymentsCardsError[] = [];
    const { error: backendPaymentsCardsErrors } = networkError;

    backendPaymentsCardsErrors.forEach((error) => {
      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_NOT_FOUND) {
        return mappedErrors.push(new CardNotFoundError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_COUNTRY_IS_INVALID) {
        return mappedErrors.push(new CardCountryIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_IS_NOT_AUTHORIZED) {
        return mappedErrors.push(new CardIsNotAuthorizedError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_IS_INVALID) {
        return mappedErrors.push(new CardOwnerIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_NAME_IS_INVALID) {
        return mappedErrors.push(new CardOwnerNameIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_FAILED) {
        return mappedErrors.push(new CardRegistrationFailedError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_IS_INVALID) {
        return mappedErrors.push(new CardRegistrationIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_TOKENIZATION_FAILED) {
        return mappedErrors.push(new CardTokenizationFailedError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.COUNTRY_ISO_CODE_IS_INVALID) {
        return mappedErrors.push(new CountryIsoCodeIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.PLATFORM_RESPONSE_IS_INVALID) {
        return mappedErrors.push(new PlatformResponseIsInvalidError());
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.UNIQUE_CARD_FOR_USER) {
        return mappedErrors.push(new UniqueCardForUserError());
      }
    });

    return mappedErrors;
  }

  private mapMangopayCardRegistrationErrorResponse(networkError: MangopayCardRegistrationErrorResponseMapped): PaymentsCardsError {
    const { error: mangopayErrorResponse } = networkError;

    if (!mangopayErrorResponse.startsWith(MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX)) {
      return new Error();
    }

    const errorCode = mangopayErrorResponse.split('=')[1];

    if (errorCode === MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.CARD_EXPIRED) {
      return new CardExpirationDateIsInvalidError();
    }

    if (errorCode === MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.CARD_NOT_ACTIVE) {
      return new CardRegistrationIsInvalidError();
    }

    if (errorCode === MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.INVALID_CARD_NUMBER) {
      return new CardNumberIsInvalidError();
    }

    if (errorCode === MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.INVALID_CVV) {
      return new CardCvvIsInvalidError();
    }

    if (errorCode === MANGOPAY_CARD_REGISTRATION_ERROR_CODES_ENUM.INVALID_DATE) {
      return new CardExpirationDateIsInvalidError();
    }

    return new CardTokenizationFailedError();
  }
}
