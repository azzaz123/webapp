import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_VERSION } from '@environments/version';
import { MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-details-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-instructions-dto.fixtures.spec';
import {
  TRANSACTION_TRACKING_DETAILS_ENDPOINT,
  TRANSACTION_TRACKING_ENDPOINT,
  TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT,
} from '@api/bff/delivery/transaction-tracking/http/endpoints';
import {
  TransactionTrackingActionTypeDto,
  TransactionTrackingDetailsDto,
  TransactionTrackingDto,
  TransactionTrackingInstructionsDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';
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

  describe('when asking transaction tracking data to server', () => {
    it('should get transaction tracking data', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = `${TRANSACTION_TRACKING_ENDPOINT}?requestId=${MOCK_REQUEST_ID}`;
      let response: TransactionTrackingDto;

      service.get(MOCK_REQUEST_ID).subscribe((properties: TransactionTrackingDto) => {
        response = properties;
      });

      const transactionTrackingRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      transactionTrackingRequest.flush(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);

      expect(response).toEqual(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);
      expect(transactionTrackingRequest.request.url).toEqual(TRANSACTION_TRACKING_ENDPOINT);
      expect(transactionTrackingRequest.request.method).toBe('GET');
      expect(transactionTrackingRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });

    it('should get transaction tracking details info', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = `${TRANSACTION_TRACKING_DETAILS_ENDPOINT}?requestId=${MOCK_REQUEST_ID}`;
      let response: TransactionTrackingDetailsDto;

      service.getDetails(MOCK_REQUEST_ID).subscribe((properties: TransactionTrackingDetailsDto) => {
        response = properties;
      });

      const transactionTrackingDetailsRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      transactionTrackingDetailsRequest.flush(MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE);

      expect(response).toEqual(MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE);
      expect(transactionTrackingDetailsRequest.request.url).toEqual(TRANSACTION_TRACKING_DETAILS_ENDPOINT);
      expect(transactionTrackingDetailsRequest.request.method).toBe('GET');
      expect(transactionTrackingDetailsRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });

    it('should get transaction tracking instructions info', () => {
      const MOCK_REQUEST_ID = '123';
      const MOCK_ACTION_TYPE: TransactionTrackingActionTypeDto = 'deeplink';
      const EXPECTED_ENDPOINT = `${TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT}?requestId=${MOCK_REQUEST_ID}&type=${MOCK_ACTION_TYPE}`;
      let response: TransactionTrackingInstructionsDto;

      service.getInstructions(MOCK_REQUEST_ID, MOCK_ACTION_TYPE).subscribe((properties: TransactionTrackingInstructionsDto) => {
        response = properties;
      });

      const transactionTrackingInstructionsRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      transactionTrackingInstructionsRequest.flush(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE);

      expect(response).toEqual(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE);
      expect(transactionTrackingInstructionsRequest.request.url).toEqual(TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT);
      expect(transactionTrackingInstructionsRequest.request.method).toBe('GET');
    });
  });
});
