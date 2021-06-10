import {
  MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE,
  MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE,
  MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE,
} from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import {
  DeliveryPostalCodesError,
  PostalCodeIsInvalidError,
  PostalCodeDoesNotExistError,
  PostalCodeIsNotAllowedError,
} from '../../classes/postal-codes';
import { DeliveryPostalCodesErrorMapper } from './delivery-postal-codes.error-mapper';

const deliveryPostalCodesErrorMapper = new DeliveryPostalCodesErrorMapper();

describe('when mapping an error from delivery postal code backend', () => {
  describe('and server notifies postal code is not valid', () => {
    it('should notify postal code is invalid error', () => {
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper
        .map(MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_INVALID_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof PostalCodeIsInvalidError).toBe(true);
    });
  });

  describe('and server notifies postal code does not exist', () => {
    it('should notify postal code does not exist error', () => {
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper
        .map(MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_DOES_NOT_EXIST_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof PostalCodeDoesNotExistError).toBe(true);
    });
  });

  describe('and server notifies postal code is not allowed', () => {
    it('should notify postal code is not allowed error', () => {
      let result: DeliveryPostalCodesError;

      deliveryPostalCodesErrorMapper
        .map(MOCK_DELIVERY_POSTAL_CODE_ERROR_POSTAL_CODE_IS_NOT_ALLOWED_RESPONSE)
        .subscribe({ error: (errors) => (result = errors[0]) });

      expect(result instanceof PostalCodeIsNotAllowedError).toBe(true);
    });
  });
});
