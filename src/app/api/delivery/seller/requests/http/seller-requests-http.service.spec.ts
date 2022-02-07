import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import {
  SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID,
} from './endpoints';

import { SellerRequestsHttpService } from './seller-requests-http.service';
import { MOCK_SELLER_REQUEST_ACCEPT_POST_OFFICE_DROP_OFF_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-accept-post-office-drop-off-dto.fixtures.spec';
import { SellerRequestAcceptPostOfficeDropOffDto } from '../dtos/seller-request-accept-post-office-drop-off-dto.interface';

describe('SellerRequestsHttpService', () => {
  const MOCK_SELLER_REQUEST_ID = '23203821337';
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

      service.cancelRequest(MOCK_SELLER_REQUEST_ID).subscribe();
      const cancelRequest: TestRequest = httpMock.expectOne(expectedUrl);
      cancelRequest.flush({});

      expect(cancelRequest.request.url).toEqual(expectedUrl);
      expect(cancelRequest.request.method).toBe('PATCH');
      expect(cancelRequest.request.body).toBe(null);
    });
  });

  describe('when asking to accept the request by id with a post office drop off mode', () => {
    it('should call to the corresponding accept request endpoint', () => {
      let response: SellerRequestAcceptPostOfficeDropOffDto;
      const expectedUrl: string = SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID(MOCK_SELLER_REQUEST_ID);

      service.acceptRequest(MOCK_SELLER_REQUEST_ID).subscribe((data: SellerRequestAcceptPostOfficeDropOffDto) => (response = data));
      const acceptRequest: TestRequest = httpMock.expectOne(expectedUrl);
      acceptRequest.flush(MOCK_SELLER_REQUEST_ACCEPT_POST_OFFICE_DROP_OFF_DTO);

      expect(acceptRequest.request.url).toEqual(expectedUrl);
      expect(acceptRequest.request.method).toBe('POST');
      expect(acceptRequest.request.body).toBe(null);
      expect(response).toBe(MOCK_SELLER_REQUEST_ACCEPT_POST_OFFICE_DROP_OFF_DTO);
    });
  });
});
