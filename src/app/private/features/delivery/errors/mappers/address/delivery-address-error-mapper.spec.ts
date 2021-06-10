import {
  MOCK_DELIVERY_ADDRESS_ERROR_ADDRESS_TOO_LONG_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_FLAT_AND_FLOOR_TOO_LONG_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_MOBILEPHONE_NUMBER_IS_INVALID_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_PHONE_NUMBER_IS_INVALID_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE,
  MOCK_DELIVERY_ADDRESS_ERROR_UNIQUE_ADDRESS_BY_USER_RESPONSE,
} from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import {
  AddressTooLongError,
  DeliveryAddressError,
  FlatAndFloorTooLongError,
  MobilePhoneNumberIsInvalidError,
  PhoneNumberIsInvalidError,
  UniqueAddressByUserError,
} from '../../classes/address';
import {
  DeliveryPostalCodesError,
  PostalCodeIsInvalidError,
  PostalCodeDoesNotExistError,
  PostalCodeIsNotAllowedError,
} from '../../classes/postal-codes';
import { DeliveryAddressErrorMapper } from './delivery-address-error-mapper';

const deliveryAddressErrorMapper = new DeliveryAddressErrorMapper();

describe('when mapping an error from delivery address backend', () => {
  describe('and server notifies delivery address location is too long', () => {
    it('should notify address too long error', () => {
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(MOCK_DELIVERY_ADDRESS_ERROR_ADDRESS_TOO_LONG_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AddressTooLongError).toBe(true);
    });
  });

  describe('and server notifies flat and floor is too long', () => {
    it('should notify flat and floor too long error', () => {
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper
        .map(MOCK_DELIVERY_ADDRESS_ERROR_FLAT_AND_FLOOR_TOO_LONG_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof FlatAndFloorTooLongError).toBe(true);
    });
  });

  describe('and server notifies invalid mobile phone number', () => {
    it('should notify mobile phone number is invalid error', () => {
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(MOCK_DELIVERY_ADDRESS_ERROR_MOBILEPHONE_NUMBER_IS_INVALID_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof MobilePhoneNumberIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies invalid phone number', () => {
    it('should notify phone number is invalid error', () => {
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper.map(MOCK_DELIVERY_ADDRESS_ERROR_PHONE_NUMBER_IS_INVALID_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PhoneNumberIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies postal code is not valid', () => {
    it('should notify postal code is invalid error', () => {
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper.map(MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies postal code does not exist', () => {
    it('should notify postal code does not exist error', () => {
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper
        .map(MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof PostalCodeDoesNotExistError).toBe(true);
    });
  });

  describe('and server notifies postal code is not allowed', () => {
    it('should notify postal code is not allowed error', () => {
      let result: DeliveryPostalCodesError;

      deliveryAddressErrorMapper
        .map(MOCK_DELIVERY_ADDRESS_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof PostalCodeIsNotAllowedError).toBe(true);
    });
  });

  describe('and server notifies address should be unique', () => {
    it('should notify unique address by user error', () => {
      let result: DeliveryAddressError;

      deliveryAddressErrorMapper
        .map(MOCK_DELIVERY_ADDRESS_ERROR_UNIQUE_ADDRESS_BY_USER_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof UniqueAddressByUserError).toBe(true);
    });
  });
});
