import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryError } from './delivery.error';

export class DeliveryErrorApi<T = DeliveryError> extends HttpErrorResponse {
  error: T[];
}
