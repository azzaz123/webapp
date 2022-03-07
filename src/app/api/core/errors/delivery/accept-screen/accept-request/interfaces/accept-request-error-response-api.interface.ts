import { HttpErrorResponse } from '@angular/common/http';
import { AcceptRequestErrorApi } from './accept-request-error-api.interface';

export class AcceptRequestErrorResponseApi<T = string> extends HttpErrorResponse {
  error: AcceptRequestErrorApi<T>[] | string;
}

export class AcceptRequestErrorResponseApiMapped<T = string> extends HttpErrorResponse {
  error: AcceptRequestErrorApi<T>[];
}
