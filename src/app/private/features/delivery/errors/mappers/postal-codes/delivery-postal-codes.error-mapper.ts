import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
import { InvalidPostalCodeError, PostalCodeDoesNotExist, PostalCodeIsNotAllowed } from '../../classes/postal-codes';
import { ErrorMapper } from '../error-mapper';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';

export type DeliveryPostalCodesErrorResponse = DeliveryErrorResponseApi<DELIVERY_POSTAL_CODES_ERROR_CODES>;

export class DeliveryPostalCodesErrorMapper extends ErrorMapper<DeliveryPostalCodesErrorResponse> {
  protected generateErrorByRequest(networkError: DeliveryPostalCodesErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE) {
        mappedErrors.push(new InvalidPostalCodeError());
      }

      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXISTS) {
        mappedErrors.push(new PostalCodeDoesNotExist());
      }

      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED) {
        mappedErrors.push(new PostalCodeIsNotAllowed());
      }
    });

    return mappedErrors;
  }
}
