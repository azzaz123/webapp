import { TestBed } from '@angular/core/testing';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { MOCK_DELIVERY_ADDRESS } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { DeliveryAddressStoreService } from './delivery-address-store.service';

describe('DeliveryAddressStoreService', () => {
  let service: DeliveryAddressStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryAddressStoreService],
    });
    service = TestBed.inject(DeliveryAddressStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the delivery address...', () => {
    beforeEach(() => {
      service.deliveryAddress = MOCK_DELIVERY_ADDRESS;
    });

    it('should update the delivery address', () => {
      expect(service.deliveryAddress).toEqual(MOCK_DELIVERY_ADDRESS);
    });

    it('should update the delivery address observable', () => {
      service.deliveryAddress$.subscribe((deliveryAddress: DeliveryAddressApi) => {
        expect(deliveryAddress).toEqual(MOCK_DELIVERY_ADDRESS);
      });
    });
  });
});
