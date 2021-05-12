import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_2 } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { of } from 'rxjs';
import { DeliveryAddressApiService } from '../../api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressStoreService } from '../delivery-address-store/delivery-address-store.service';

import { DeliveryAddressService } from './delivery-address.service';

describe('DeliveryAddressService', () => {
  let service: DeliveryAddressService;
  let deliveryAddressStoreService: DeliveryAddressStoreService;
  let deliveryAddressApiService: DeliveryAddressApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryAddressService, DeliveryAddressApiService, DeliveryAddressStoreService],
    });

    service = TestBed.inject(DeliveryAddressService);
    deliveryAddressStoreService = TestBed.inject(DeliveryAddressStoreService);
    deliveryAddressApiService = TestBed.inject(DeliveryAddressApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the delivery address...', () => {
    describe('and the cache is activated...', () => {
      describe('and we have the address already saved...', () => {
        it('should get the address from the store', () => {
          spyOn(deliveryAddressApiService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS_2));
          jest.spyOn(deliveryAddressStoreService, 'deliveryAddress', 'get').mockReturnValue(MOCK_DELIVERY_ADDRESS);
          jest.spyOn(deliveryAddressStoreService, 'deliveryAddress$', 'get').mockReturnValue(of(MOCK_DELIVERY_ADDRESS));

          service.get().subscribe((deliveryAddress: DeliveryAddressApi) => {
            expect(deliveryAddress).toBe(MOCK_DELIVERY_ADDRESS);
          });

          expect(deliveryAddressApiService.get).not.toHaveBeenCalled();
        });
      });

      describe(`and we don't have the address already saved...`, () => {
        it('should request the address', () => {
          spyOn(deliveryAddressApiService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS_2));
          jest.spyOn(deliveryAddressStoreService, 'deliveryAddress', 'get').mockReturnValue(null);

          service.get().subscribe();

          expect(deliveryAddressApiService.get).toHaveBeenCalled();
        });
      });
    });

    describe('and the cache is not activated...', () => {
      it('should request the address', () => {
        spyOn(deliveryAddressApiService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));

        service.get(false).subscribe();

        expect(deliveryAddressApiService.get).toHaveBeenCalled();
      });
    });
  });

  describe('when creating the delivery address...', () => {
    it('should call the api service', () => {
      spyOn(deliveryAddressApiService, 'create').and.returnValue(of(null));

      service.updateOrCreate(MOCK_DELIVERY_ADDRESS, true).subscribe();

      expect(deliveryAddressApiService.create).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS);
    });
  });

  describe('when updating the delivery address...', () => {
    it('should call the api service', () => {
      spyOn(deliveryAddressApiService, 'update').and.returnValue(of(null));

      service.updateOrCreate(MOCK_DELIVERY_ADDRESS, false).subscribe();

      expect(deliveryAddressApiService.update).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS);
    });
  });
});
