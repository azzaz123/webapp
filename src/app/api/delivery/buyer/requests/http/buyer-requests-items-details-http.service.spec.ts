import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BUYER_REQUESTS_ITEMS_DETAILS } from '@api/delivery/buyer/requests/http/endpoints';
import { BuyerRequestItemDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-item-details-dto.interface';
import { BuyerRequestsItemsDetailsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-items-details-http.service';
import { MOCK_BUYER_REQUEST_ITEM_DETAILS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-request-item-details-dto.fixtures.spec';

describe('BuyerRequestsItemsDetailsService', () => {
  const MOCK_BUYER_REQUEST_ITEM_HASH = 'abc1234';
  let service: BuyerRequestsItemsDetailsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerRequestsItemsDetailsHttpService],
    });
    service = TestBed.inject(BuyerRequestsItemsDetailsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the buyer request with the item details', () => {
    it('should ask server for an specific request', () => {
      let response: BuyerRequestItemDetailsDto;
      const expectedUrl: string = BUYER_REQUESTS_ITEMS_DETAILS(MOCK_BUYER_REQUEST_ITEM_HASH);

      service.getRequestItem(MOCK_BUYER_REQUEST_ITEM_HASH).subscribe((data: BuyerRequestItemDetailsDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BUYER_REQUEST_ITEM_DETAILS_DTO);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_BUYER_REQUEST_ITEM_DETAILS_DTO);
    });
  });
});
