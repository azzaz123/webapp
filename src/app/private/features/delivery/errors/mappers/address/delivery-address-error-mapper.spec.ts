import { fakeAsync, tick } from '@angular/core/testing';
import { MOCK_DELIVERY_BASE_ERROR_RESPONSE } from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import {
  AddressTooLongError,
  DeliveryAddressError,
  FlatAndFloorTooLongError,
  InvalidMobilePhoneNumberError,
  InvalidPhoneNumberError,
  UniqueAddressByUserError,
} from '../../classes/address';
import { DeliveryErrorApi } from '../../classes/delivery-error-response-api';
import {
  DeliveryPostalCodesError,
  InvalidPostalCodeError,
  PostalCodeDoesNotExistError,
  PostalCodeIsNotAllowedError,
} from '../../classes/postal-codes';
import { DeliveryAddressErrorMapper, DeliveryAddressErrorResponse } from './delivery-address-error-mapper';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';

const deliveryAddressErrorMapper = new DeliveryAddressErrorMapper();

describe('when mapping an error from delivery address backend', () => {
  describe('and server notifies delivery address location is too long', () => {
    it('should notify invalid postal code error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG,
        message: 'Delivery address is too long ( ͡° ͜ʖ ͡°)',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe({
        error: (errors) => (result = errors[0]),
      });
      tick();

      expect(result instanceof AddressTooLongError).toBe(true);
    }));
  });

  describe('and server notifies flat and floor is too long', () => {
    it('should notify flat and floor too long error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.FLAT_AND_FLOOR_TOO_LONG,
        message: 'Flat and floor too long ( ͡° ͜ʖ ͡°)',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof FlatAndFloorTooLongError).toBe(true);
    }));
  });

  describe('and server notifies invalid mobile phone number', () => {
    it('should notify invalid mobile phone number error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_MOBILE_PHONE_NUMBER,
        message: 'The contact number must be from the country you are located',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof InvalidMobilePhoneNumberError).toBe(true);
    }));
  });

  describe('and server notifies invalid phone number', () => {
    it('should notify invalid phone number error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER,
        message: 'The phone number is invalid',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof InvalidPhoneNumberError).toBe(true);
    }));
  });

  describe('and server notifies postal code is not valid', () => {
    it('should notify invalid postal code error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_POSTAL_CODE,
        message: 'Postal code XXX is not valid',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof InvalidPostalCodeError).toBe(true);
    }));
  });

  describe('and server notifies postal code does not exist', () => {
    it('should notify postal code does not exist error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXIST,
        message: 'Postal code XXX es invent',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof PostalCodeDoesNotExistError).toBe(true);
    }));
  });

  describe('and server notifies postal code is not allowed', () => {
    it('should notify postal code is not allowed error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED,
        message: 'Postal code XXX not allowed',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof PostalCodeIsNotAllowedError).toBe(true);
    }));
  });

  describe('and server notifies address should be unique', () => {
    it('should notify unique address by user error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.UNIQUE_ADDRESS_BY_USER,
        message: 'Cagada pastorets',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...MOCK_DELIVERY_BASE_ERROR_RESPONSE,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof UniqueAddressByUserError).toBe(true);
    }));
  });
});
