import { DeliveryErrorApi } from '../../../errors/delivery/delivery-api.error';
import { DeliveryPostalCodesError } from '../../../errors/delivery/postal-codes/delivery-postal-codes.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from '../../../errors/delivery/postal-codes/delivery-postal-codes-error.enum';
import { InvalidPostalCodeError } from '../../../errors/delivery/postal-codes/invalid-postal-code.error';
import { PostalCodeDoesNotExist } from '../../../errors/delivery/postal-codes/postal-code-does-not-exist.error';
import { PostalCodeIsNotAllowed } from '../../../errors/delivery/postal-codes/postal-code-is-not-allowed.error';
import { ErrorMapper } from '../../error-mapper';

export class DeliveryPostalCodesErrorMapper extends ErrorMapper {
  protected generateErrorByRequest(networkError: DeliveryErrorApi<DeliveryPostalCodesError>): Error[] {
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
