import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransactionTrackingActionDeeplink } from '@api/core/model/delivery/transaction/tracking';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { mapDeeplinkToCustomerHelp } from '@core/external-links/deeplink-to-customer-help/deeplink-to-customer-help.mapper';
import { APP_LOCALE_MOCK } from '@fixtures/analytics.fixtures.spec';

import { TransactionTrackingActionsService } from './transaction-tracking-actions.service';

describe('TransactionTrackingActionsService', () => {
  const MOCK_DEEP_LINK_ACTION = MOCK_TRANSACTION_TRACKING.header.detail.action as TransactionTrackingActionDeeplink;
  const MOCK_CARRIER_TRACKING_WEBVIEW_ACTION = MOCK_TRANSACTION_TRACKING.statusInfo[0].action as TransactionTrackingActionDeeplink;

  let service: TransactionTrackingActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionTrackingActionsService,
        {
          provide: LOCALE_ID,
          useValue: APP_LOCALE_MOCK,
        },
      ],
    });
    service = TestBed.inject(TransactionTrackingActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we handle a transaction tracking action...', () => {
    describe('and the action is a deeplink', () => {
      it('should open the mapped url in a new page', () => {
        const deeplinkURLMapped = mapDeeplinkToCustomerHelp(APP_LOCALE_MOCK, MOCK_DEEP_LINK_ACTION.linkUrl);
        spyOn(window, 'open');

        service.manageAction(MOCK_DEEP_LINK_ACTION);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(deeplinkURLMapped, '_blank');
      });
    });

    describe('and the action is carrier tracking webview', () => {
      it('should open the tracking url in a new page', () => {
        spyOn(window, 'open');

        service.manageAction(MOCK_CARRIER_TRACKING_WEBVIEW_ACTION);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(MOCK_CARRIER_TRACKING_WEBVIEW_ACTION.linkUrl, '_blank');
      });
    });
  });
});
