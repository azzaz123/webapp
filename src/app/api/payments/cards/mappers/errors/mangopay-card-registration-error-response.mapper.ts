import { ToApiMapper } from '@api/core/utils/types';
import {
  MangopayCardRegistrationErrorResponseApi,
  MangopayCardRegistrationErrorResponseMapped,
} from '../../dtos/errors/mangopay-card-registration-error-response-api';

export const mapMangopayCardRegistrationErrorResponse: ToApiMapper<
  MangopayCardRegistrationErrorResponseApi,
  MangopayCardRegistrationErrorResponseMapped
> = (input: MangopayCardRegistrationErrorResponseApi): MangopayCardRegistrationErrorResponseMapped => {
  return new MangopayCardRegistrationErrorResponseMapped({ error: input, status: 400 });
};
