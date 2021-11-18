import { fakeAsync, flush, TestBed } from '@angular/core/testing';

import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE } from '@api/fixtures/bff/delivery';
import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { of } from 'rxjs';

describe('TransactionTrackingService', () => {
  let service: TransactionTrackingService;
  let transactionTrackingHttpService: TransactionTrackingHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionTrackingService,
        {
          provide: TransactionTrackingHttpService,
          useValue: {
            get() {
              return of(MOCK_TRANSACTION_TRACKING_DTO_RESPONSE);
            },
            getDetails() {
              return of(MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE);
            },
          },
        },
      ],
    });
    service = TestBed.inject(TransactionTrackingService);
    transactionTrackingHttpService = TestBed.inject(TransactionTrackingHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN they ask for the transaction tracking info', () => {
    const requestId = 'This is my request Id';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, 'get').and.callThrough();
    });

    it('should call to get the information', () => {
      service.get(requestId).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to get the information with the request id', () => {
      service.get(requestId).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId);
    });

    it('should return the transation tracking', fakeAsync(() => {
      const expected = MOCK_TRANSACTION_TRACKING;
      let response: TransactionTracking;

      service.get(requestId).subscribe((data) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });

  describe('WHEN they ask for the transaction tracking details info', () => {
    const requestId = 'This is my request Id';
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = spyOn(transactionTrackingHttpService, 'getDetails').and.callThrough();
    });

    it('should call to get the information', () => {
      service.getDetails(requestId).subscribe();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call to get the information with the request id', () => {
      service.getDetails(requestId).subscribe();

      expect(spy).toHaveBeenCalledWith(requestId);
    });

    it('should return the transation tracking details', fakeAsync(() => {
      const expected = MOCK_TRANSACTION_TRACKING_DETAILS;
      let response: TransactionTrackingDetails;

      service.getDetails(requestId).subscribe((data) => {
        response = data;

        expect(JSON.stringify(response)).toEqual(JSON.stringify(expected));
      });

      flush();
    }));
  });
});
