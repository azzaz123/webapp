import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { DeliveryErrorResponseApi } from '@private/features/delivery/errors/classes/delivery-error-response-api';

export const MOCK_ERROR_RESPONSE: HttpErrorResponse = {
  message: 'Http failure response',
  name: 'HttpErrorResponse',
  ok: false,
  status: 409,
  statusText: 'Conflict',
  url: 'url',
  error: null,
  type: HttpEventType.Response,
  headers: new HttpHeaders(),
};

export const MOCK_DELIVERY_BASE_ERROR_RESPONSE: DeliveryErrorResponseApi = {
  ...MOCK_ERROR_RESPONSE,
  error: [],
};
