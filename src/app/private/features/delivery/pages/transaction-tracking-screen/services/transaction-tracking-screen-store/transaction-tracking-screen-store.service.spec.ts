import { TestBed } from '@angular/core/testing';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';

import { TransactionTrackingScreenStoreService } from './transaction-tracking-screen-store.service';

describe('TransactionTrackingScreenStoreService', () => {
  let service: TransactionTrackingScreenStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTrackingScreenStoreService],
    });
    service = TestBed.inject(TransactionTrackingScreenStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when updating transaction tracking information...', () => {
    beforeEach(() => {
      service.transactionTracking = MOCK_TRANSACTION_TRACKING;
    });

    it('should update the transaction tracking information', () => {
      service.transactionTracking$.subscribe((expectedValue: TransactionTracking) => {
        expect(expectedValue).toStrictEqual(MOCK_TRANSACTION_TRACKING);
      });
    });
  });

  describe('when updating transaction tracking details...', () => {
    beforeEach(() => {
      service.transactionTrackingDetails = MOCK_TRANSACTION_TRACKING_DETAILS;
    });

    it('should update the transaction tracking details', () => {
      service.transactionTrackingDetails$.subscribe((expectedValue: TransactionTrackingDetails) => {
        expect(expectedValue).toStrictEqual(MOCK_TRANSACTION_TRACKING_DETAILS);
      });
    });
  });
});
