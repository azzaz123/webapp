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
import { TransactionTrackingActionUserActionComponent } from '../transaction-tracking-action-user-action/transaction-tracking-action-user-action.component';
import { TransactionTrackingActionTrackingWebviewComponent } from '../transaction-tracking-action-tracking-webview/transaction-tracking-action-tracking-webview.component';
import {
  MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK,
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG,
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
  MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

describe('TransactionTrackingActionSelectorComponent', () => {
  let component: TransactionTrackingActionSelectorComponent;
  let fixture: ComponentFixture<TransactionTrackingActionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TransactionTrackingActionSelectorComponent,
        TransactionTrackingActionDialogComponent,
        TransactionTrackingActionDeeplinkComponent,
        TransactionTrackingActionTrackingWebviewComponent,
        TransactionTrackingActionUserActionComponent,
      ],
      imports: [ImageFallbackModule, TransactionTrackingDeeplinkModule, ItemDetailRouteModule, UserProfileRouteModule, BypassHTMLModule],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
        {
          provide: TransactionTrackingService,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive the action', () => {
    describe('and the action is a dialog', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG;
        fixture.detectChanges();
      });

      it('should show the transaction action type dialog', () => {
        isTransactionTrackingActionDialog(true);
      });

      it('should NOT show the transaction action type deeplink', () => {
        isTransactionTrackingActionDeeplink(false);
      });

      it('should NOT show the transaction action type tracking webview', () => {
        isTransactionTrackingActionTrackingWebview(false);
      });

      it('should NOT show the transaction action type user action', () => {
        isTransactionTrackingActionUserAction(false);
      });
    });

    describe('and the action is a carrier tracking webview', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW;
        fixture.detectChanges();
      });

      it('should NOT show the transaction action type dialog', () => {
        isTransactionTrackingActionDialog(false);
      });

      it('should NOT show the transaction action type deeplink', () => {
        isTransactionTrackingActionDeeplink(false);
      });

      it('should show the transaction action type tracking webview', () => {
        isTransactionTrackingActionTrackingWebview(true);
      });

      it('should NOT show the transaction action type user action', () => {
        isTransactionTrackingActionUserAction(false);
      });
    });

    describe('and the action is a deeplink', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK;
        fixture.detectChanges();
      });

      it('should NOT show the transaction action type dialog', () => {
        isTransactionTrackingActionDialog(false);
      });

      it('should show the transaction action type deeplink', () => {
        isTransactionTrackingActionDeeplink(true);
      });

      it('should NOT show the transaction action type tracking webview', () => {
        isTransactionTrackingActionTrackingWebview(false);
      });

      it('should NOT show the transaction action type user action', () => {
        isTransactionTrackingActionUserAction(false);
      });
    });

    describe('and the action is a user action', () => {
      beforeEach(() => {
        component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION;
        fixture.detectChanges();
      });

      it('should NOT show the transaction action type dialog', () => {
        isTransactionTrackingActionDialog(false);
      });

      it('should NOT show the transaction action type deeplink', () => {
        isTransactionTrackingActionDeeplink(false);
      });

      it('should NOT show the transaction action type tracking webview', () => {
        isTransactionTrackingActionTrackingWebview(false);
      });

      it('should show the transaction action type user action', () => {
        isTransactionTrackingActionUserAction(true);
      });
    });
  });

  function isTransactionTrackingActionDialog(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionDialogComponent, shouldShow);
  }

  function isTransactionTrackingActionDeeplink(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionDeeplinkComponent, shouldShow);
  }

  function isTransactionTrackingActionTrackingWebview(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionTrackingWebviewComponent, shouldShow);
  }

  function isTransactionTrackingActionUserAction(shouldShow: boolean) {
    shouldShowComponent(TransactionTrackingActionUserActionComponent, shouldShow);
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
