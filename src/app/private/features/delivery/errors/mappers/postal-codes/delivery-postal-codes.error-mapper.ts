import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
import { PostalCodeIsInvalidError, PostalCodeDoesNotExistError, PostalCodeIsNotAllowedError } from '../../classes/postal-codes';
import { ErrorMapper } from '../error-mapper';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';

export type DeliveryPostalCodesErrorResponse = DeliveryErrorResponseApi<DELIVERY_POSTAL_CODES_ERROR_CODES>;

export class DeliveryPostalCodesErrorMapper extends ErrorMapper<DeliveryPostalCodesErrorResponse> {
  protected generateErrorByRequest(networkError: DeliveryPostalCodesErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE) {
        mappedErrors.push(new PostalCodeIsInvalidError());
      }

      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXIST) {
        mappedErrors.push(new PostalCodeDoesNotExistError());
      }

      if (error.error_code === DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED) {
        mappedErrors.push(new PostalCodeIsNotAllowedError(error.error_code));
      }
    });

    return mappedErrors;
  }
}
