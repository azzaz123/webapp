import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import {
  AddressTooLongError,
  DeliveryAddressError,
  FlatAndFloorTooLongError,
  InvalidMobilePhoneNumber,
  InvalidPhoneNumberError,
} from '../../classes/address';
import { DeliveryErrorApi } from '../../classes/delivery-error-response-api';
import { DeliveryAddressErrorMapper, DeliveryAddressErrorResponse } from './delivery-address-error-mapper';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';

const deliveryAddressErrorMapper = new DeliveryAddressErrorMapper();

const commonErrorResponseAttributes: DeliveryAddressErrorResponse = {
  message: 'Http failure response',
  name: 'HttpErrorResponse',
  ok: false,
  status: 409,
  statusText: 'Conflict',
  url: 'url',
  error: [],
  type: HttpEventType.Response,
  headers: new HttpHeaders(),
};

describe('when mapping an error from delivery address backend', () => {
  describe('and server notifies delivery address location is too long', () => {
    it('should notify invalid postal code error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG,
        message: 'Delivery address is too long ( ͡° ͜ʖ ͡°)',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...commonErrorResponseAttributes,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
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
        ...commonErrorResponseAttributes,
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
        ...commonErrorResponseAttributes,
        error: [mockErrorResponse],
      };
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(mockBackendError).subscribe(
        () => {},
        (errors) => (result = errors[0])
      );
      tick();

      expect(result instanceof InvalidMobilePhoneNumber).toBe(true);
    }));
  });

  describe('and server notifies invalid phone number', () => {
    it('should notify invalid phone number error', fakeAsync(() => {
      const mockErrorResponse: DeliveryErrorApi<DELIVERY_ADDRESS_ERROR_CODES> = {
        error_code: DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER,
        message: 'The phone number is invalid',
      };
      const mockBackendError: DeliveryAddressErrorResponse = {
        ...commonErrorResponseAttributes,
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
});
