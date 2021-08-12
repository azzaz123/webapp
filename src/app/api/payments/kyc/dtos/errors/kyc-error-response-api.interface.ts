import { HttpErrorResponse } from '@angular/common/http';
import { KYCErrorApi } from './kyc-error-api.interface';

export class KYCErrorResponseApi<T = string> extends HttpErrorResponse {
  error: KYCErrorApi<T>[] | string;
}

export class KYCErrorResponseApiMapped<T = string> extends HttpErrorResponse {
  error: KYCErrorApi<T>[];
}
