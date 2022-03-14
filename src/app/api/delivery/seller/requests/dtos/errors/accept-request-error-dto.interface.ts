import { ACCEPT_REQUEST_ERROR_CODES } from '../../mappers/errors/accept-request/accept-request-error-codes.enum';

export interface AcceptRequestErrorDto {
  error_code: ACCEPT_REQUEST_ERROR_CODES;
  message: string;
}
