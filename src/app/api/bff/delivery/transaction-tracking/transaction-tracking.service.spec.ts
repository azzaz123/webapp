import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TRANSACTION_TRACKING_ENDPOINT } from './endpoints';

import { TransactionTrackingService } from './transaction-tracking.service';

describe('TransactionTrackingService', () => {
  let service: TransactionTrackingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTrackingService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TransactionTrackingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking transaction tracking info to server', () => {
    it('should get transaction tracking info', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = `${TRANSACTION_TRACKING_ENDPOINT}?requestId=${MOCK_REQUEST_ID}`;
      let response: any;

      service.get(MOCK_REQUEST_ID).subscribe((properties: any) => {
        response = properties;
      });

      const transactionTrackingInfoRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      transactionTrackingInfoRequest.flush({});

      expect(response).toEqual({});
      expect(transactionTrackingInfoRequest.request.url).toEqual(TRANSACTION_TRACKING_ENDPOINT);
      expect(transactionTrackingInfoRequest.request.method).toBe('GET');
    });
  });
});
