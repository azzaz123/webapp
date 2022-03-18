import { mapToDeliveryAddress } from '@private/features/payview/services/payview/payview.mappers';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_API } from '@api/fixtures/delivery/address/delivery-address.fixtures.spec';

describe('WHEN there is no input', () => {
  it('should return null', () => {
    expect(mapToDeliveryAddress(null)).toBeNull();
  });
});

describe('WHEN receive a valid input', () => {
  it('should map to the corresponding delivery address', () => {
    expect(mapToDeliveryAddress(MOCK_DELIVERY_ADDRESS_API)).toEqual(MOCK_DELIVERY_ADDRESS);
  });
});
