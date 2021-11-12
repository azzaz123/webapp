import { TestBed } from '@angular/core/testing';
import { MOCK_TRANSACTION_TRACKING_INFO } from '@fixtures/private/delivery/transaction-tracking-screen/transaction-tracking-info.fixtures.spec';

import { TransactionTrackingActionsService } from './transaction-tracking-actions.service';

describe('TransactionTrackingActionsService', () => {
  const MOCK_DEEP_LINK_ACTION = MOCK_TRANSACTION_TRACKING_INFO.header.detail.action;
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

        service.manageAction(MOCK_DEEP_LINK_ACTION);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(MOCK_DEEP_LINK_ACTION.payload.linkUrl, '_blank');
      });
    });
  });
});
