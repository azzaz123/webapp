import { TestBed } from '@angular/core/testing';

import { DeliveryExperimentalFeaturesService } from './delivery-experimental-features.service';

describe('DeliveryExperimentalFeaturesService', () => {
  let service: DeliveryExperimentalFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryExperimentalFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
