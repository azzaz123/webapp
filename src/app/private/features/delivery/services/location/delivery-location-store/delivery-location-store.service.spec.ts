import { TestBed } from '@angular/core/testing';
import { DeliveryLocationsStoreService } from './delivery-location-store.service';

describe('DeliveryLocationsStoreService', () => {
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
});
