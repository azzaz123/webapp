import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingActionDialogComponent } from '../transaction-tracking-action-dialog/transaction-tracking-action-dialog.component';
import { TransactionTrackingActionDeeplinkComponent } from '../transaction-tracking-action-deeplink/transaction-tracking-action-deeplink.component';
import { TransactionTrackingActionSelectorComponent } from './transaction-tracking-action-selector.component';
import { TransactionTrackingActionUserActionComponent } from '../transaction-tracking-action-user-action/transaction-tracking-action-user-action.component';
import { TransactionTrackingActionTrackingWebviewComponent } from '../transaction-tracking-action-tracking-webview/transaction-tracking-action-tracking-webview.component';
import {
  MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK,
  MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK_WITH_ANALYTICS,
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG,
  MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS,
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION,
  MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS,
  MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW,
  MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW_WITH_ANALYTICS,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-tracking-actions.fixtures.spec';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { ErrorsService } from '@core/errors/errors.service';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { TransactionTrackingScreenTrackingEventsService } from '../../../services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';

describe('TransactionTrackingActionSelectorComponent', () => {
  let component: TransactionTrackingActionSelectorComponent;
  let fixture: ComponentFixture<TransactionTrackingActionSelectorComponent>;
  let de: DebugElement;
  let transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TransactionTrackingActionSelectorComponent,
        TransactionTrackingActionDialogComponent,
        TransactionTrackingActionDeeplinkComponent,
        TransactionTrackingActionTrackingWebviewComponent,
        TransactionTrackingActionUserActionComponent,
      ],
      imports: [ImageFallbackModule, ItemDetailRouteModule, UserProfileRouteModule, BypassHTMLModule],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
        {
          provide: TransactionTrackingService,
          useValue: {},
        },
        {
          provide: DeeplinkService,
          useValue: {},
        },
        {
          provide: ErrorsService,
          useValue: MockErrorService,
        },
        {
          provide: TransactionTrackingScreenTrackingEventsService,
          useValue: {
            trackClickActionTTS() {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionSelectorComponent);
    de = fixture.debugElement;
    transactionTrackingScreenTrackingEventsService = TestBed.inject(TransactionTrackingScreenTrackingEventsService);
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

      describe('and we click on the action', () => {
        beforeEach(() => {
          spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        });

        describe('and the action has analytics', () => {
          beforeEach(() => {
            component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS;
            fixture.detectChanges();
          });

          it('should track the event', () => {
            de.query(By.directive(TransactionTrackingActionDialogComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
              MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS.analytics.requestId,
              MOCK_TRANSACTION_TRACKING_ACTION_DIALOG_WITH_ANALYTICS.analytics.source
            );
          });
        });

        describe('and the action has NOT analytics', () => {
          it('should NOT track the event', () => {
            de.query(By.directive(TransactionTrackingActionDialogComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
          });
        });
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

      describe('and we click on the action', () => {
        beforeEach(() => {
          spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        });

        describe('and the action has analytics', () => {
          beforeEach(() => {
            component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW_WITH_ANALYTICS;
            fixture.detectChanges();
          });

          it('should track the event', () => {
            de.query(By.directive(TransactionTrackingActionTrackingWebviewComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
              MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW_WITH_ANALYTICS.analytics.requestId,
              MOCK_TRANSACTION_TRACKING_ACTION_WEBVIEW_WITH_ANALYTICS.analytics.source
            );
          });
        });

        describe('and the action has NOT analytics', () => {
          it('should NOT track the event', () => {
            de.query(By.directive(TransactionTrackingActionTrackingWebviewComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
          });
        });
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

      describe('and we click on the action', () => {
        beforeEach(() => {
          spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        });

        describe('and the action has analytics', () => {
          beforeEach(() => {
            component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK_WITH_ANALYTICS;
            fixture.detectChanges();
          });

          it('should track the event', () => {
            de.query(By.directive(TransactionTrackingActionDeeplinkComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
              MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK_WITH_ANALYTICS.analytics.requestId,
              MOCK_TRANSACTION_TRACKING_ACTION_DEEPLINK_WITH_ANALYTICS.analytics.source
            );
          });
        });

        describe('and the action has NOT analytics', () => {
          it('should NOT track the event', () => {
            de.query(By.directive(TransactionTrackingActionDeeplinkComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
          });
        });
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

      describe('and we click on the action', () => {
        beforeEach(() => {
          spyOn(transactionTrackingScreenTrackingEventsService, 'trackClickActionTTS');
        });

        describe('and the action has analytics', () => {
          beforeEach(() => {
            component.actionDetail = MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS;
            fixture.detectChanges();
          });

          it('should track the event', () => {
            de.query(By.directive(TransactionTrackingActionUserActionComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledTimes(1);
            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).toHaveBeenCalledWith(
              MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS.analytics.requestId,
              MOCK_TRANSACTION_TRACKING_ACTION_USER_ACTION_WITH_ANALYTICS.analytics.source
            );
          });
        });

        describe('and the action has NOT analytics', () => {
          it('should NOT track the event', () => {
            de.query(By.directive(TransactionTrackingActionUserActionComponent)).nativeElement.click();

            expect(transactionTrackingScreenTrackingEventsService.trackClickActionTTS).not.toHaveBeenCalled();
          });
        });
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
    const component = de.query(By.directive(componentSelector));

    if (shouldShowIt) {
      expect(component).toBeTruthy();
    } else {
      expect(component).toBeFalsy();
    }
  }
});
