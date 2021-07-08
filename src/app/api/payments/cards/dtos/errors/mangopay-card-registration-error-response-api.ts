import { HttpErrorResponse } from '@angular/common/http';

export type MangopayCardRegistrationErrorResponseApi = string;

export class MangopayCardRegistrationErrorResponseMapped extends HttpErrorResponse {
  error: MangopayCardRegistrationErrorResponseApi;
}

export const MANGOPAY_CARD_REGISTRATION_ERROR_RESPONSE_PREFIX = 'errorCode';
