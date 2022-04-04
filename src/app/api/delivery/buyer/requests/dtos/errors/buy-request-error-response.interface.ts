import { HttpErrorResponse } from '@angular/common/http';
import { BuyRequestErrorDto } from './buy-request-error-dto.interface';

export class BuyRequestErrorResponse extends HttpErrorResponse {
  error: BuyRequestErrorDto[];
}
