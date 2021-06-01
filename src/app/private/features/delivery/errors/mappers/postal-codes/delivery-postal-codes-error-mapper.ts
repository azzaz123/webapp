import { DeliveryErrorApi } from '../../classes/delivery-api.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from '../../classes/postal-codes/delivery-postal-codes-error.enum';
import { DeliveryPostalCodesError } from '../../classes/postal-codes/delivery-postal-codes.error';
import { InvalidPostalCodeError } from '../../classes/postal-codes/invalid-postal-code.error';
import { PostalCodeDoesNotExist } from '../../classes/postal-codes/postal-code-does-not-exist.error';
import { PostalCodeIsNotAllowed } from '../../classes/postal-codes/postal-code-is-not-allowed.error';
import { ErrorMapper } from '../error-mapper';

export type DeliveryPostalCodesErrorResponse = DeliveryErrorApi<DeliveryPostalCodesError>;

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
