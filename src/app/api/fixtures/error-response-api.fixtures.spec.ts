import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';

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
