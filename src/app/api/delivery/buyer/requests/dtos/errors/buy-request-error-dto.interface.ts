import { BUY_REQUEST_ERROR_CODES } from '../../mappers/errors/buy-request/buy-request-error-codes.enum';

export interface BuyRequestErrorDto {
  error_code: BUY_REQUEST_ERROR_CODES;
  message: string;
}
