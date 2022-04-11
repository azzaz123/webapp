import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewErrorApi } from '@private/features/payview/interfaces/payview-error-api.interface';
import { PayviewHttpErrorResponse } from '@private/features/payview/interfaces/payview-http-error-response.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapToPayviewError: ToDomainMapper<PayviewHttpErrorResponse, PayviewError> = (input: PayviewHttpErrorResponse) => {
  if (!input) {
    return null;
  }

  const error: PayviewErrorApi = !!input.error ? input.error[0] : null;
  return !!error ? getError(error.error_code, error.message) : getError(input.status?.toString(), input.message);
};

const getError = (code: string, message: string): PayviewError => {
  return {
    code: code ?? null,
    message: message ?? null,
  };
};
