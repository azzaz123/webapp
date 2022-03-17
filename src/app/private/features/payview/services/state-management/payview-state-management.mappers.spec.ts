import { mapToPayviewError } from '@private/features/payview/services/state-management/payview-state-management.mappers';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewErrorApi } from '@private/features/payview/interfaces/payview-error-api.interface';
import { PayviewHttpErrorResponse } from '@private/features/payview/interfaces/payview-http-error-response.interface';

const fakePayviewErrorApi: PayviewErrorApi = {
  error_code: 'fake_error_code',
  message: 'fake_error_message',
};

const fakeUnexpectedErrorWithStatus = {
  message: '',
  status: 0,
};

const fakeUnexpectedErrorWithoutStatus = {
  message: '',
};

const fakeUnexpectedEmptyError = {};

const fakePayviewError: PayviewError = {
  code: 'fake_error_code',
  message: 'fake_error_message',
};

const fakePayviewHttpErrorResponse: PayviewHttpErrorResponse = {
  error: [fakePayviewErrorApi],
  name: 'HttpErrorResponse',
  message: '',
  ok: false,
  headers: null,
  status: 0,
  statusText: '',
  url: '',
  type: null,
};

describe('WHEN there is no input', () => {
  it('should return null', () => {
    const result = mapToPayviewError(null);

    expect(result).toBeNull();
  });
});

describe('WHEN we received an error from backend', () => {
  it('should map to the corresponding error', () => {
    const result = mapToPayviewError(fakePayviewHttpErrorResponse);

    expect(result).toEqual(fakePayviewError);
  });
});

describe('WHEN we received an error that does not come from backend', () => {
  describe('WHEN the error contains status and message properties', () => {
    it('should map to the corresponding error', () => {
      const expected: PayviewError = {
        code: '0',
        message: '',
      };

      const result = mapToPayviewError(fakeUnexpectedErrorWithStatus as PayviewHttpErrorResponse);

      expect(result).toEqual(expected);
    });
  });

  describe('WHEN the error does not contains status property', () => {
    it('should map to the corresponding error', () => {
      const expected: PayviewError = {
        code: null,
        message: '',
      };

      const result = mapToPayviewError(fakeUnexpectedErrorWithoutStatus as PayviewHttpErrorResponse);

      expect(result).toEqual(expected);
    });
  });

  describe('WHEN the error does not contains status nor message properties', () => {
    it('should map to the corresponding error', () => {
      const expected: PayviewError = {
        code: null,
        message: null,
      };

      const result = mapToPayviewError(fakeUnexpectedEmptyError as PayviewHttpErrorResponse);

      expect(result).toEqual(expected);
    });
  });
});
