import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_TRANSACTION_DETAILS } from '@fixtures/private/delivery/transactional-tracking-screen/transaction-details.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingDeeplinkModule } from '../../../pipes/transaction-tracking-deeplink.module';
import { TransactionDetailModalComponent } from '../../transaction-details/transaction-detail-modal/transaction-detail-modal.component';
import { TransactionDetailRedirectionComponent } from '../../transaction-details/transaction-detail-redirection/transaction-detail-redirection.component';
import { TransactionDetailWithoutActionComponent } from '../../transaction-details/transaction-detail-without-action/transaction-detail-without-action.component';

import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';

describe('TransactionTrackingDetailInfoComponent', () => {
  let component: TransactionTrackingDetailInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TransactionTrackingDetailInfoComponent,
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
    fixture = TestBed.createComponent(TransactionTrackingDetailInfoComponent);
    component = fixture.componentInstance;
    component.transactionTrackingDetails = MOCK_TRANSACTION_TRACKING_DETAILS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting transaction tracking details...', () => {
    describe('and we get the detail info slots', () => {
      it('should return the transaction tracking details mapped', () => {
        expect(component.detailInfoSlots).toStrictEqual(MOCK_TRANSACTION_DETAILS);
      });
    });

    describe('and we show the slots', () => {
      it('should show the components related to the action types', () => {
        const transactionDetailWithoutAction = fixture.debugElement.queryAll(By.directive(TransactionDetailWithoutActionComponent)).length;
        const transactionDetailModalAction = fixture.debugElement.queryAll(By.directive(TransactionDetailModalComponent)).length;
        const transactionDetailRedirectionAction = fixture.debugElement.queryAll(
          By.directive(TransactionDetailRedirectionComponent)
        ).length;

        const transactionDetailWithoutActionExpected = MOCK_TRANSACTION_DETAILS.filter(
          (transactionDetail) => !transactionDetail.action
        ).length;
        const transactionDetailModalActionExpected = MOCK_TRANSACTION_DETAILS.filter(
          (transactionDetail) => transactionDetail.action?.isDialog
        ).length;
        const transactionDetailRedirectionActionExpected = MOCK_TRANSACTION_DETAILS.filter(
          (transactionDetail) => transactionDetail.action?.isDeeplink || transactionDetail.action?.isCarrierTrackingWebview
        ).length;

        expect(transactionDetailWithoutAction).toEqual(transactionDetailWithoutActionExpected);
        expect(transactionDetailModalAction).toEqual(transactionDetailModalActionExpected);
        expect(transactionDetailRedirectionAction).toEqual(transactionDetailRedirectionActionExpected);
      });
    });
  });
});
