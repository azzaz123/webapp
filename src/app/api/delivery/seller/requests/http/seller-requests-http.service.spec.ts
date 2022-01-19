import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import { SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID } from './endpoints';

import { SellerRequestsHttpService } from './seller-requests-http.service';

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
});
