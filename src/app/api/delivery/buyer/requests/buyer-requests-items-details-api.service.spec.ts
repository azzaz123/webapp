import { TestBed } from '@angular/core/testing';

import { BuyerRequestsItemsDetailsApiService } from './buyer-requests-items-details-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BuyerRequestsItemsDetailsHttpService } from './http/buyer-requests-items-details-http.service';

describe('BuyerRequestsItemsDetailsApiService', () => {
  let service: BuyerRequestsItemsDetailsApiService;
  let buyerRequestsItemsDetailsHttpService: BuyerRequestsItemsDetailsHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerRequestsItemsDetailsHttpService, BuyerRequestsItemsDetailsApiService],
    });
    service = TestBed.inject(BuyerRequestsItemsDetailsApiService);
    buyerRequestsItemsDetailsHttpService = TestBed.inject(BuyerRequestsItemsDetailsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
