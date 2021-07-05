import { HttpErrorResponse } from '@angular/common/http';

export interface WalletErrorApi<T = string> {
  error_code: T;
  message: string;
}

export class WalletErrorResponseApi<T = string> extends HttpErrorResponse {
  error: WalletErrorApi<T>[];
}
