import { HttpErrorResponse } from '@angular/common/http';

export interface DeliveryErrorApi<T = string> {
  error_code: T;
  message: string;
}

export class DeliveryErrorResponseApi<T = string> extends HttpErrorResponse {
  error: DeliveryErrorApi<T>[];
}
