import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_VERSION } from '@environments/version';
import { MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-details-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-instructions-dto.fixtures.spec';
import {
  TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT,
  TRANSACTION_TRACKING_DETAILS_ENDPOINT,
  TRANSACTION_TRACKING_ENDPOINT,
  TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT,
  TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT,
  TRANSACTION_TRACKING_PACKAGE_ARRIVED_ENDPOINT,
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
      const MOCK_ACTION_TYPE: TransactionTrackingActionTypeDto = 'dialog';
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
      expect(transactionTrackingInstructionsRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });

  describe('when canceling a transaction', () => {
    it('should call to the corresponding cancelation endpoint', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT.replace(/\{0\}/g, MOCK_REQUEST_ID);

      service.sendCancelTransaction(MOCK_REQUEST_ID).subscribe();

      const cancelTransactionRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      cancelTransactionRequest.flush(null);

      expect(cancelTransactionRequest.request.url).toEqual(EXPECTED_ENDPOINT);
      expect(cancelTransactionRequest.request.method).toBe('DELETE');
      expect(cancelTransactionRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });

  describe('when expiring the claim period for a transaction', () => {
    it('should call to the corresponding expiration claim period endpoint', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT.replace(/\{0\}/g, MOCK_REQUEST_ID);

      service.sendExpireClaimPeriod(MOCK_REQUEST_ID).subscribe();

      const expireClaimPeriodRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      expireClaimPeriodRequest.flush(null);

      expect(expireClaimPeriodRequest.request.url).toEqual(EXPECTED_ENDPOINT);
      expect(expireClaimPeriodRequest.request.method).toBe('PATCH');
      expect(expireClaimPeriodRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });

  describe('when arriving the package', () => {
    it('should call to the corresponding package arrived endpoint', () => {
      const MOCK_REQUEST_ID = '123';
      const EXPECTED_ENDPOINT = TRANSACTION_TRACKING_PACKAGE_ARRIVED_ENDPOINT.replace(/\{0\}/g, MOCK_REQUEST_ID);

      service.sendPackageArrived(MOCK_REQUEST_ID).subscribe();

      const packageArrivedRequest: TestRequest = httpMock.expectOne(EXPECTED_ENDPOINT);
      packageArrivedRequest.flush(null);

      expect(packageArrivedRequest.request.url).toEqual(EXPECTED_ENDPOINT);
      expect(packageArrivedRequest.request.method).toBe('POST');
      expect(packageArrivedRequest.request.headers.get('X-AppVersion')).toEqual(APP_VERSION.replace(/\./g, ''));
    });
  });
});
