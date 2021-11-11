import { TestBed } from '@angular/core/testing';
import { MOCK_TRANSACTION_TRACKING } from '@fixtures/private/delivery/TTS/transaction-tracking.fixtures.spec';

import { TransactionTrackingActionsService } from './transaction-tracking-actions.service';

describe('TransactionTrackingActionsService', () => {
  let service: TransactionTrackingActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionTrackingActionsService],
    });
    service = TestBed.inject(TransactionTrackingActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we handle a transaction tracking action...', () => {
    describe('and the action is a deeplink', () => {
      it('should open the link url in a new page', () => {
        spyOn(window, 'open');

        service.manageAction(MOCK_TRANSACTION_TRACKING.header.action);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(MOCK_TRANSACTION_TRACKING.header.action.payload.linkUrl, '_blank');
      });
    });
  });
});
