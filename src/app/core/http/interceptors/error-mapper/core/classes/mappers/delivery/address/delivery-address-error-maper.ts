import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMapper } from '../../error-mapper';

export class DeliveryAddressErrorMapper extends ErrorMapper {
  protected generateErrorByRequest(networkError: HttpErrorResponse): Error {
    return new Error(networkError.message);
  }
}
