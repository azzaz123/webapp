import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION_IT } from '@fixtures/private/delivery/delivery-location.fixtures.spec';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { DeliveryLocationsStoreService } from './delivery-locations-store.service';

describe('DeliveryLocationsStoreService', () => {
  const MOCK_DELIVERY_LOCATIONS = [MOCK_DELIVERY_LOCATION, MOCK_DELIVERY_LOCATION_IT];
  let service: DeliveryLocationsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryLocationsStoreService],
    });
    service = TestBed.inject(DeliveryLocationsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the delivery locations...', () => {
    beforeEach(() => {
      service.deliveryLocations = MOCK_DELIVERY_LOCATIONS;
    });

    it('should update the delivery locations', () => {
      expect(service.deliveryLocations).toEqual(MOCK_DELIVERY_LOCATIONS);
    });

    it('should update the delivery locations observable', () => {
      service.deliveryLocations$.subscribe((deliveryLocations: DeliveryLocationApi[]) => {
        expect(deliveryLocations).toEqual(MOCK_DELIVERY_LOCATIONS);
      });
    });
  });
});
