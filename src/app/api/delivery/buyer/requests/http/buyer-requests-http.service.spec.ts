import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  BUYER_REQUESTS_ENDPOINT,
  BUYER_REQUESTS_ITEMS_DETAILS,
  BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY,
} from '@api/delivery/buyer/requests/http/endpoints';
import { BuyerRequestsItemsDetailsDto } from '@api/delivery/buyer/requests/dtos/buyer-requests-items-details-dto.interface';
import { BuyerRequestsDto } from '@api/delivery/buyer/requests/dtos/buyer-request-dto.interface';
import { BuyerRequestsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-http.service';
import { MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';
import { MOCK_BUYER_REQUESTS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-dto.fixtures.spec';
import { MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS } from '@api/fixtures/delivery/buyer/requests/buyer-request-buy-dto.fixtures.spec';
import { APP_VERSION } from '@environments/version';

describe('BuyerRequestsHttpService', () => {
  const MOCK_ITEM_HASH: string = '9jdxdd2rylzk';
  let service: BuyerRequestsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerRequestsHttpService],
    });
    service = TestBed.inject(BuyerRequestsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the buyer request by item hash to the server', () => {
    it('should ask server for requests', () => {
      let response: BuyerRequestsDto;
      const expectedUrl: string = `${BUYER_REQUESTS_ENDPOINT}?${BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY}=${MOCK_ITEM_HASH}`;

      service.get(MOCK_ITEM_HASH).subscribe((data: BuyerRequestsDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BUYER_REQUESTS_DTO);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('item_hash')).toEqual(MOCK_ITEM_HASH);
      expect(response).toEqual(MOCK_BUYER_REQUESTS_DTO);
    });
  });

  describe('when asking to get the item details', () => {
    it('should ask server for an specific request', () => {
      let response: BuyerRequestsItemsDetailsDto;
      const fakeItemHash: string = 'abc1234';
      const expectedUrl: string = BUYER_REQUESTS_ITEMS_DETAILS(fakeItemHash);

      service.getItemsDetails(fakeItemHash).subscribe((data: BuyerRequestsItemsDetailsDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO);
    });
  });

  describe('when asking to buy the buyer request', () => {
    const expectedUrl: string = BUYER_REQUESTS_ENDPOINT;
    let buyRequest: TestRequest;

    beforeEach(() => {
      service.buy(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS).subscribe();
      buyRequest = httpMock.expectOne(expectedUrl);
      buyRequest.flush({});
    });

    it('should ask the server with valid petition type', () => {
      expect(buyRequest.request.method).toBe('POST');
    });

    it('should ask the server with the expected body', () => {
      expect(buyRequest.request.body).toStrictEqual(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS);
    });

    it('should have the app version header', () => {
      expect(buyRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });
});
