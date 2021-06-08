import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_ADDRESS, MOCK_DELIVERY_ADDRESS_2 } from '@fixtures/private/delivery/delivery-address.fixtures.spec';
import { MOCK_DELIVERY_ADDRESS_ERRORS } from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import { DeliveryAddressError } from '@private/features/delivery/errors/classes/address';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { of, throwError } from 'rxjs';
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

          service.get().subscribe((deliveryAddress: DeliveryAddressApi) => {
            expect(deliveryAddress).toBe(MOCK_DELIVERY_ADDRESS);
          });

          expect(deliveryAddressApiService.get).not.toHaveBeenCalled();
        });
      });

      describe(`and we don't have the address already saved...`, () => {
        beforeEach(() => {
          spyOn(deliveryAddressApiService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS_2));
          deliveryAddressStoreService.deliveryAddress = null;

          service.get().subscribe();
        });

        it('should request the address', () => {
          expect(deliveryAddressApiService.get).toHaveBeenCalled();
        });

        it('should update the delivery address in the store', () => {
          expect(deliveryAddressStoreService.deliveryAddress).toStrictEqual(MOCK_DELIVERY_ADDRESS_2);
        });
      });
    });

    describe('and the cache is not activated...', () => {
      beforeEach(() => {
        spyOn(deliveryAddressApiService, 'get').and.returnValue(of(MOCK_DELIVERY_ADDRESS));

        service.get(false).subscribe();
      });

      it('should request the address', () => {
        expect(deliveryAddressApiService.get).toHaveBeenCalled();
      });

      it('should update the delivery address in the store', () => {
        expect(deliveryAddressStoreService.deliveryAddress).toStrictEqual(MOCK_DELIVERY_ADDRESS);
      });
    });
  });

  describe('when creating the delivery address...', () => {
    describe('and the petition succeed...', () => {
      beforeEach(() => {
        spyOn(deliveryAddressApiService, 'create').and.returnValue(of(null));

        service.updateOrCreate(MOCK_DELIVERY_ADDRESS, true).subscribe();
      });

      it('should call the api service', () => {
        expect(deliveryAddressApiService.create).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS);
      });

      it('should update the delivery address in the store', () => {
        expect(deliveryAddressStoreService.deliveryAddress).toEqual(MOCK_DELIVERY_ADDRESS);
      });
    });

    describe('and the petition fails...', () => {
      it('should map the error to DeliveryAddressError', () => {
        let response: DeliveryAddressError[];
        spyOn(deliveryAddressApiService, 'create').and.returnValue(throwError(MOCK_DELIVERY_ADDRESS_ERRORS));

        service.updateOrCreate(MOCK_DELIVERY_ADDRESS, true).subscribe({
          error: (deliveryAddressErrors: DeliveryAddressError[]) => {
            response = deliveryAddressErrors;
          },
        });

        response.forEach((error) => {
          expect(error instanceof DeliveryAddressError).toBeTruthy();
        });
      });
    });
  });

  describe('when updating the delivery address...', () => {
    describe('and the petition succeed...', () => {
      beforeEach(() => {
        spyOn(deliveryAddressApiService, 'update').and.returnValue(of(null));

        service.updateOrCreate(MOCK_DELIVERY_ADDRESS, false).subscribe();
      });

      describe('and the petition succeed...', () => {
        it('should call the api service', () => {
          expect(deliveryAddressApiService.update).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS);
        });

        it('should update the delivery address in the store', () => {
          expect(deliveryAddressStoreService.deliveryAddress).toEqual(MOCK_DELIVERY_ADDRESS);
        });
      });
    });

    describe('and the petition fails...', () => {
      it('should map the error to DeliveryAddressError', () => {
        let response: DeliveryAddressError[];
        spyOn(deliveryAddressApiService, 'update').and.returnValue(throwError(MOCK_DELIVERY_ADDRESS_ERRORS));

        service.updateOrCreate(MOCK_DELIVERY_ADDRESS, false).subscribe({
          error: (deliveryAddressErrors: DeliveryAddressError[]) => {
            response = deliveryAddressErrors;
          },
        });

        response.forEach((error) => {
          expect(error instanceof DeliveryAddressError).toBeTruthy();
        });
      });
    });
  });

  describe('when deleting the delivery address...', () => {
    beforeEach(() => {
      spyOn(deliveryAddressApiService, 'delete').and.returnValue(of(null));

      service.delete(MOCK_DELIVERY_ADDRESS.id).subscribe();
    });

    it('should call the api service', () => {
      expect(deliveryAddressApiService.delete).toHaveBeenCalledWith(MOCK_DELIVERY_ADDRESS.id);
    });

    it('should update the delivery address in the store', () => {
      expect(deliveryAddressStoreService.deliveryAddress).toEqual(null);
    });
  });
});
