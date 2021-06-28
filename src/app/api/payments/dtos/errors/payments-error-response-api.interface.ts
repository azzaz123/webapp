import { HttpErrorResponse } from '@angular/common/http';
import { PaymentsErrorApi } from './payments-error-api.interface';

export class PaymentsErrorResponseApi<T = string> extends HttpErrorResponse {
  error: PaymentsErrorApi<T>[];
}
