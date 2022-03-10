import { HttpErrorResponse } from '@angular/common/http';
import { AcceptRequestErrorDto } from './accept-request-error-dto.interface';

export class AcceptRequestErrorResponse extends HttpErrorResponse {
  error: AcceptRequestErrorDto[];
}
