import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeliveryAddressApiService } from './delivery-address-api.service';

describe('DeliveryAddressApiService', () => {
  let service: DeliveryAddressApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryAddressApiService],
    });
    service = TestBed.inject(DeliveryAddressApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
