import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingModel } from '@api/core/model/delivery/transaction/tracking/models/transaction-tracking.model';
import { MOCK_TRANSACTION_TRACKING_DTO_RESPONSE } from '@api/fixtures/bff/delivery/transaction-tracking/transaction-tracking-dto.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { of } from 'rxjs';
import { TransactionTrackingHttpService } from './http/transaction-tracking-http.service';

import { TransactionTrackingService } from './transaction-tracking.service';

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
