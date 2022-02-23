import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import {
  SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ENDPOINT,
} from './endpoints';

import { SellerRequestsHttpService } from './seller-requests-http.service';
import { APP_VERSION } from '@environments/version';

describe('SellerRequestsHttpService', () => {
  const MOCK_SELLER_REQUEST_ID: string = '23203821337';
  const MOCK_ITEM_HASH: string = 'dqjwm31nkezo';
  const MOCK_BUYER_HASH: string = 'mxzod8nyv4j9';

  let service: SellerRequestsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SellerRequestsHttpService],
    });
    service = TestBed.inject(SellerRequestsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the seller requests by buyer and item to server', () => {
    it('should ask server for all requests done by the buyer for the item', () => {
      const expectedUrl: string = `${SELLER_REQUESTS_ENDPOINT}?buyer_user_hash=${MOCK_BUYER_HASH}&item_hash=${MOCK_ITEM_HASH}`;

      service.getRequestsByBuyerAndItem(MOCK_BUYER_HASH, MOCK_ITEM_HASH).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush([MOCK_SELLER_REQUEST_DTO, MOCK_SELLER_REQUEST_DTO]);

      expect(req.request.method).toBe('GET');
    });
  });

  describe('when asking to get the seller request by id to server', () => {
    it('should ask server for an specific request', () => {
      let response: SellerRequestDto;
      const expectedUrl: string = SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(MOCK_SELLER_REQUEST_ID);

      service.getRequestInfo(MOCK_SELLER_REQUEST_ID).subscribe((data: SellerRequestDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_SELLER_REQUEST_DTO);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_SELLER_REQUEST_DTO);
    });
  });

  describe('when asking to cancel the request by id to server', () => {
    it('should call to the corresponding cancel request endpoint', () => {
      const expectedUrl: string = SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(MOCK_SELLER_REQUEST_ID);

      service.rejectRequest(MOCK_SELLER_REQUEST_ID).subscribe();
      const rejectRequest: TestRequest = httpMock.expectOne(expectedUrl);
      rejectRequest.flush({});

      expect(rejectRequest.request.url).toEqual(expectedUrl);
      expect(rejectRequest.request.method).toBe('PATCH');
      expect(rejectRequest.request.body).toStrictEqual({ status: 'rejected' });
    });
  });

  describe('when asking to accept the request by id with post office drop off mode', () => {
    const expectedUrl: string = SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID(MOCK_SELLER_REQUEST_ID);
    let acceptRequest: TestRequest;
    beforeEach(() => {
      service.acceptRequestPostOfficeDropOff(MOCK_SELLER_REQUEST_ID).subscribe();
      acceptRequest = httpMock.expectOne(expectedUrl);
      acceptRequest.flush({});
    });

    it('should ask the server with valid petition type', () => {
      expect(acceptRequest.request.method).toBe('POST');
    });

    it('should ask the server with the transaction id', () => {
      expect(acceptRequest.request.body).toStrictEqual({ transaction_id: MOCK_SELLER_REQUEST_ID });
    });

    it('should have the App version header', () => {
      expect(acceptRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });

  describe('when asking to accept the request by id with home pickup mode', () => {
    const expectedUrl: string = SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID(MOCK_SELLER_REQUEST_ID);
    let acceptRequest: TestRequest;
    beforeEach(() => {
      service.acceptRequestHomePickup(MOCK_SELLER_REQUEST_ID).subscribe();
      acceptRequest = httpMock.expectOne(expectedUrl);
      acceptRequest.flush({});
    });

    it('should ask the server with valid petition type', () => {
      expect(acceptRequest.request.method).toBe('POST');
    });

    it('should ask the server with the transaction id', () => {
      expect(acceptRequest.request.body).toStrictEqual({ transaction_id: MOCK_SELLER_REQUEST_ID });
    });

    it('should have the App version header', () => {
      expect(acceptRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });
});
