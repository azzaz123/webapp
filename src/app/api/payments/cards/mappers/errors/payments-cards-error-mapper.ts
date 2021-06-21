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
} from '@api/core/errors/payments/cards';
import { ErrorMapper } from '@api/core/utils/classes';
import { PaymentsCardsErrorResponseApi } from '../../dtos/errors/payments-cards-error-response-api.interface';
import { PAYMENTS_CARDS_ERROR_CODES } from './payments-cards-error-codes.enum';

export class PaymentsCardsErrorMapper extends ErrorMapper<PaymentsCardsErrorResponseApi> {
  protected generateErrorByRequest(networkError: PaymentsCardsErrorResponseApi): PaymentsCardsError[] {
    const mappedErrors: PaymentsCardsError[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_NOT_FOUND) {
        return new CardNotFoundError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_COUNTRY_IS_INVALID) {
        return new CardCountryIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_IS_NOT_AUTHORIZED) {
        return new CardIsNotAuthorizedError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_IS_INVALID) {
        return new CardOwnerIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_OWNER_NAME_IS_INVALID) {
        return new CardOwnerNameIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_FAILED) {
        return new CardRegistrationFailedError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_REGISTRATION_IS_INVALID) {
        return new CardRegistrationIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.CARD_TOKENIZATION_FAILED) {
        return new CardTokenizationFailedError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.COUNTRY_ISO_CODE_IS_INVALID) {
        return new CountryIsoCodeIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.PLATFORM_RESPONSE_IS_INVALID) {
        return new PlatformResponseIsInvalidError();
      }

      if (error.error_code === PAYMENTS_CARDS_ERROR_CODES.UNIQUE_CARD_FOR_USER) {
        return new UniqueCardForUserError();
      }
    });

    return mappedErrors;
  }
}
