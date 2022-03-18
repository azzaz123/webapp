import { HttpErrorResponse } from '@angular/common/http';

import { PayviewErrorApi } from '@private/features/payview/interfaces/payview-error-api.interface';

export interface PayviewHttpErrorResponse extends HttpErrorResponse {
  error: PayviewErrorApi[];
}
