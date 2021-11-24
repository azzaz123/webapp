import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import {
  MOCK_TRANSACTION_DETAIL_CARRIER_TRACKING_WEBVIEW,
  MOCK_TRANSACTION_DETAIL_DEEPLINK,
  MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION,
} from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { TransactionDetailModalComponent } from '../transaction-detail-modal/transaction-detail-modal.component';
import { TransactionDetailRedirectionComponent } from '../transaction-detail-redirection/transaction-detail-redirection.component';
import { TransactionDetailWithoutActionComponent } from '../transaction-detail-without-action/transaction-detail-without-action.component';
import { TransactionDetailSelectorComponent } from './transaction-detail-selector.component';

describe('TransactionDetailSelectorComponent', () => {
  let component: TransactionDetailSelectorComponent;
  let fixture: ComponentFixture<TransactionDetailSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TransactionDetailSelectorComponent,
        TransactionDetailWithoutActionComponent,
        TransactionDetailModalComponent,
        TransactionDetailRedirectionComponent,
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
    fixture = TestBed.createComponent(TransactionDetailSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we receive the transaction detail', () => {
    describe('and it has not action', () => {
      beforeEach(() => {
        component.transactionDetail = MOCK_TRANSACTION_DETAIL_WITHOUT_ACTION;
        fixture.detectChanges();
      });

      it('should NOT show the transaction detail modal component', () => {
        isTransactionDetailModalInTemplate(false);
      });

      it('should NOT show the transaction detail redirection component', () => {
        isTransactionDetailRedirectionTemplate(false);
      });

      it('should show the transaction detail without action component', () => {
        isTransactionDetailWithoutActionInTemplate(true);
      });
    });

    describe('and it has action', () => {
      // TODO: check dialog type		Date: 2021/11/24
      xdescribe('and the action is a dialog', () => {
        beforeEach(() => {
          component.transactionDetail = MOCK_TRANSACTION_DETAIL_DEEPLINK;
          fixture.detectChanges();
        });

        it('should show the transaction detail modal component', () => {
          isTransactionDetailModalInTemplate(true);
        });

        it('should NOT show the transaction detail redirection component', () => {
          isTransactionDetailRedirectionTemplate(false);
        });

        it('should NOT show the transaction detail without action component', () => {
          isTransactionDetailWithoutActionInTemplate(false);
        });
      });

      describe('and the action is a carrier tracking webview', () => {
        beforeEach(() => {
          component.transactionDetail = MOCK_TRANSACTION_DETAIL_CARRIER_TRACKING_WEBVIEW;
          fixture.detectChanges();
        });

        it('should NOT show the transaction detail modal component', () => {
          isTransactionDetailModalInTemplate(false);
        });

        it('should  show the transaction detail redirection component', () => {
          isTransactionDetailRedirectionTemplate(true);
        });

        it('should NOT show the transaction detail without action component', () => {
          isTransactionDetailWithoutActionInTemplate(false);
        });
      });

      describe('and the action is a deeplink', () => {
        beforeEach(() => {
          component.transactionDetail = MOCK_TRANSACTION_DETAIL_DEEPLINK;
          fixture.detectChanges();
        });

        it('should NOT show the transaction detail modal component', () => {
          isTransactionDetailModalInTemplate(false);
        });

        it('should  show the transaction detail redirection component', () => {
          isTransactionDetailRedirectionTemplate(true);
        });

        it('should NOT show the transaction detail without action component', () => {
          isTransactionDetailWithoutActionInTemplate(false);
        });
      });
    });
  });

  describe(`and we don't receive any transaction detail`, () => {
    beforeEach(() => {
      component.transactionDetail = null;
      fixture.detectChanges();
    });

    it('should  NOT show the transaction detail modal component', () => {
      isTransactionDetailModalInTemplate(false);
    });

    it('should NOT show the transaction detail redirection component', () => {
      isTransactionDetailRedirectionTemplate(false);
    });

    it('should NOT show the transaction detail without action component', () => {
      isTransactionDetailWithoutActionInTemplate(false);
    });
  });

  function isTransactionDetailWithoutActionInTemplate(shouldShow: boolean) {
    shouldShowComponent(TransactionDetailWithoutActionComponent, shouldShow);
  }

  function isTransactionDetailModalInTemplate(shouldShow: boolean) {
    shouldShowComponent(TransactionDetailModalComponent, shouldShow);
  }
  function isTransactionDetailRedirectionTemplate(shouldShow: boolean) {
    shouldShowComponent(TransactionDetailRedirectionComponent, shouldShow);
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
