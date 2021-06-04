import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { MOCK_DELIVERY_BASE_ERROR_RESPONSE } from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import { DeliveryErrorApi } from '../../classes/delivery-error-response-api';
import {
  DeliveryPostalCodesError,
  InvalidPostalCodeError,
  PostalCodeDoesNotExistError,
  PostalCodeIsNotAllowedError,
} from '../../classes/postal-codes';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorMapper, DeliveryPostalCodesErrorResponse } from './delivery-postal-codes.error-mapper';

const deliveryPostalCodesErrorMapper = new DeliveryPostalCodesErrorMapper();

describe('when mapping an error from delivery postal code backend', () => {
  describe('and server notifies postal code is not valid', () => {
    it('should notify invalid postal code error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
        error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE,
        message: 'Postal code XXX is not valid',
      };
      const mockBackendError: DeliveryPostalCodesErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof InvalidPostalCodeError).toBe(true);
    }));
  });

  describe('and server notifies postal code does not exist', () => {
    it('should notify postal code does not exist error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
        error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXISTS,
        message: 'Postal code XXX es invent',
      };
      const mockBackendError: DeliveryPostalCodesErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof PostalCodeDoesNotExistError).toBe(true);
    }));
  });

  describe('and server notifies postal code is not allowed', () => {
    it('should notify postal code is not allowed error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_POSTAL_CODES_ERROR_CODES> = {
        error_code: DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED,
        message: 'Postal code XXX not allowed',
      };
      const mockBackendError: DeliveryPostalCodesErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof PostalCodeIsNotAllowedError).toBe(true);
    }));
  });
});
