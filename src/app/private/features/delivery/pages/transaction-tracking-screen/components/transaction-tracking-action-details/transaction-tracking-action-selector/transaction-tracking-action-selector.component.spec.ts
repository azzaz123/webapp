import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { TransactionTrackingActionDialogComponent } from '../transaction-tracking-action-dialog/transaction-tracking-action-dialog.component';
import { TransactionTrackingActionDeeplinkComponent } from '../transaction-tracking-action-deeplink/transaction-tracking-action-deeplink.component';
import { TransactionTrackingActionSelectorComponent } from './transaction-tracking-action-selector.component';
import { MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1 } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import {
  MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1,
  MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';

describe('TransactionTrackingActionSelectorComponent', () => {
  let component: TransactionTrackingActionSelectorComponent;
  let fixture: ComponentFixture<TransactionTrackingActionSelectorComponent>;

  // TODO: rename all test		Date: 2021/11/25
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TransactionTrackingActionSelectorComponent,
        TransactionTrackingActionDialogComponent,
        TransactionTrackingActionDeeplinkComponent,
      ],
      imports: [ImageFallbackModule, TransactionTrackingDeeplinkModule, ItemDetailRouteModule, UserProfileRouteModule, BypassHTMLModule],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive the action', () => {
    describe('and the action is a dialog', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_SHIPPING_STATUS_1.actions[0].action;
        fixture.detectChanges();
      });

      it('should show the transaction detail modal component', () => {
        isTransactionDetailModalInTemplate(true);
      });

      it('should NOT show the transaction detail redirection component', () => {
        isTransactionDetailRedirectionTemplate(false);
      });
    });

    describe('and the action is a carrier tracking webview', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1.action;
        fixture.detectChanges();
      });

      it('should NOT show the transaction detail modal component', () => {
        isTransactionDetailModalInTemplate(false);
      });

      it('should  show the transaction detail redirection component', () => {
        isTransactionDetailRedirectionTemplate(true);
      });
    });

    describe('and the action is a deeplink', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1.action;
        fixture.detectChanges();
      });

      it('should NOT show the transaction detail modal component', () => {
        isTransactionDetailModalInTemplate(false);
      });

      it('should  show the transaction detail redirection component', () => {
        isTransactionDetailRedirectionTemplate(true);
      });
    });
  });

  describe(`and we don't receive any action`, () => {
    beforeEach(() => {
      component.actionDetail = null;
      fixture.detectChanges();
    });

    it('should  NOT show the transaction detail modal component', () => {
      isTransactionDetailModalInTemplate(false);
    });

    it('should NOT show the transaction detail redirection component', () => {
      isTransactionDetailRedirectionTemplate(false);
    });
  });

  function isTransactionDetailModalInTemplate(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionDialogComponent, shouldShow);
  }
  function isTransactionDetailRedirectionTemplate(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionDeeplinkComponent, shouldShow);
  }
  function shouldShowComponent(componentSelector: Type<unknown>, shouldShowIt: boolean): void {
    const component = fixture.debugElement.query(By.directive(componentSelector));

    if (shouldShowIt) {
      expect(component).toBeTruthy();
    } else {
      expect(component).toBeFalsy();
    }
  }
});
