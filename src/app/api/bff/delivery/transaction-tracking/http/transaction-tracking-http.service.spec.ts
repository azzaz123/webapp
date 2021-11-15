import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { TRANSACTION_TRACKING_ENDPOINT } from '@api/bff/delivery/transaction-tracking/http/endpoints';
import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';

describe('TransactionTrackingHttpService', () => {
  let service: TransactionTrackingHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTrackingHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TransactionTrackingHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking transaction tracking info to server', () => {
    it('should get transaction tracking info', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = `${TRANSACTION_TRACKING_ENDPOINT}?requestId=${MOCK_REQUEST_ID}`;
      let response: TransactionTrackingDto;

      service.get(MOCK_REQUEST_ID).subscribe((properties: TransactionTrackingDto) => {
        response = properties;
      });

      const transactionTrackingInfoRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      transactionTrackingInfoRequest.flush(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);

      expect(response).toEqual(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);
      expect(transactionTrackingInfoRequest.request.url).toEqual(TRANSACTION_TRACKING_ENDPOINT);
      expect(transactionTrackingInfoRequest.request.method).toBe('GET');
    });
  });
});
