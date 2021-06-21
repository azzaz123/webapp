import { PaymentsCardsError } from '@api/core/errors/payments/cards/payments-cards.error';
import { ErrorMapper } from '@api/core/utils/classes';
import { PaymentsCardsErrorResponseApi } from '../../dtos/errors/payments-cards-error-response-api.interface';

export class PaymentsCardsErrorMapper extends ErrorMapper<PaymentsCardsErrorResponseApi> {
  protected generateErrorByRequest(networkError: PaymentsCardsErrorResponseApi): PaymentsCardsError[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {});

    return mappedErrors;
  }
}
