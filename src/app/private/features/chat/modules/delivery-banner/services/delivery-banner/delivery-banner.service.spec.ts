import { TestBed } from '@angular/core/testing';

import { DeliveryBannerService } from './delivery-banner.service';

describe('DeliveryBannerService', () => {
  let service: DeliveryBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
