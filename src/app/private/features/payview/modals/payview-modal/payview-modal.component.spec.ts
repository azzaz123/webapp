import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { ItemService } from '@core/item/item.service';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './payview-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FakeComponent extends PayviewModalComponent {
  constructor(payviewStateManagementService: PayviewStateManagementService, payviewDeliveryService: PayviewDeliveryService) {
    super(payviewStateManagementService, payviewDeliveryService);
  }
}

describe('PayviewModalComponent', () => {
  const fakeItemHash: string = 'This_is_a_fake_item_hash';
  const payviewModalSummary: string = '.PayviewModal';
  const payviewModalSummarySelector: string = `${payviewModalSummary}__summary`;
  const payviewModalSummarySpinner: string = `${payviewModalSummary}__spinner`;
  const payviewSummaryOverviewSelector: string = 'tsl-payview-summary-overview';

  let component: PayviewModalComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewModalComponent>;
  let itemHashSpy: jest.SpyInstance;
  let payviewDeliveryService: PayviewDeliveryService;
  let payviewDeliverySpy;
  let payviewStateManagementService: PayviewStateManagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        FakeComponent,
        PayviewDeliveryHeaderComponent,
        PayviewDeliveryOverviewComponent,
        PayviewDeliveryPointComponent,
        PayviewDeliveryPointsComponent,
        PayviewSummaryCostDetailComponent,
        PayviewSummaryHeaderComponent,
        PayviewSummaryOverviewComponent,
        PayviewSummaryPaymentMethodComponent,
        SvgIconComponent,
      ],
      imports: [BrowserAnimationsModule, BuyerRequestsApiModule, DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [
        DeliveryAddressService,
        DeliveryAddressStoreService,
        ItemService,
        NgbActiveModal,
        PaymentsWalletsService,
        PaymentsWalletsHttpService,
        PayviewDeliveryService,
        PayviewStateManagementService,
      ],
    }).compileComponents();
  });

  describe('WHEN the component initializes', () => {
    describe('AND WHEN the item has been reported', () => {
      beforeEach(() => {
        payviewStateManagementService = TestBed.inject(PayviewStateManagementService);
        itemHashSpy = jest.spyOn(payviewStateManagementService, 'itemHash', 'set');
        payviewDeliveryService = TestBed.inject(PayviewDeliveryService);
        payviewDeliverySpy = jest.spyOn(payviewDeliveryService, 'deliveryMethodSelected', 'get');

        fixture = TestBed.createComponent(FakeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.itemHash = fakeItemHash;

        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should assign the item hash received', fakeAsync(() => {
        expect(itemHashSpy).toBeCalledTimes(1);
        expect(itemHashSpy).toBeCalledWith(fakeItemHash);
      }));

      it('should subscribe to the listener', () => {
        expect(payviewDeliverySpy).toHaveBeenCalledTimes(1);
      });

      describe('WHEN the payview gets the state', () => {
        beforeEach(() => {
          jest.spyOn(payviewStateManagementService, 'payViewState$', 'get').mockReturnValue(of(MOCK_PAYVIEW_STATE));

          fixture = TestBed.createComponent(FakeComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;
          component.itemHash = fakeItemHash;

          fixture.detectChanges();
        });

        it('should show the summary block', () => {
          const summaryBlock = debugElement.query(By.css(payviewModalSummarySelector));

          expect(summaryBlock).toBeTruthy();
        });

        it('should not show the loading animation', fakeAsync(() => {
          const loadingContainerRef = fixture.debugElement.query(By.css(payviewModalSummarySpinner));
          expect(loadingContainerRef).toBeFalsy();
        }));
      });
    });

    describe('WHEN the delivery method has been selected', () => {
      let targetSpy;

      beforeEach(() => {
        payviewStateManagementService = TestBed.inject(PayviewStateManagementService);
        itemHashSpy = jest.spyOn(payviewStateManagementService, 'itemHash', 'set');
        payviewDeliveryService = TestBed.inject(PayviewDeliveryService);
        payviewDeliverySpy = jest
          .spyOn(payviewDeliveryService, 'deliveryMethodSelected', 'get')
          .mockReturnValue(of(MOCK_DELIVERY_BUYER_DELIVERY_METHODS[0]));
        targetSpy = spyOn(payviewStateManagementService, 'setDeliveryMethod').and.callFake(() => {});

        fixture = TestBed.createComponent(FakeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.itemHash = fakeItemHash;

        fixture.detectChanges();
      });

      it('should set the delivery method received', () => {
        expect(targetSpy).toHaveBeenCalledTimes(1);
        expect(targetSpy).toHaveBeenCalledWith(MOCK_DELIVERY_BUYER_DELIVERY_METHODS[0]);
      });
    });

    describe('AND WHEN the item has not been reported', () => {
      beforeEach(() => {
        payviewStateManagementService = TestBed.inject(PayviewStateManagementService);
        itemHashSpy = jest.spyOn(payviewStateManagementService, 'itemHash', 'set');

        fixture = TestBed.createComponent(FakeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.itemHash = null;

        fixture.detectChanges();
      });

      it('should assign the current item hash', fakeAsync(() => {
        expect(itemHashSpy).toBeCalledTimes(1);
        expect(itemHashSpy).toBeCalledWith(null);
      }));

      it('should show the loading animation', fakeAsync(() => {
        const loadingContainerRef = fixture.debugElement.query(By.css(payviewModalSummarySpinner));
        expect(loadingContainerRef).toBeTruthy();
      }));

      describe('WHEN the state does not have a value', () => {
        beforeEach(() => {
          jest.spyOn(payviewStateManagementService, 'payViewState$', 'get').mockReturnValue(of(null));
          fixture = TestBed.createComponent(FakeComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          fixture.detectChanges();
        });

        it('should not show the summary block', () => {
          const summaryBlock = debugElement.query(By.css(payviewModalSummarySelector));

          expect(summaryBlock).toBeFalsy();
        });

        it('should show the summary overview component', () => {
          const summaryOverviewComponent = debugElement.query(By.css(payviewSummaryOverviewSelector));

          expect(summaryOverviewComponent).toBeFalsy();
        });
      });

      describe('WHEN the state has a value', () => {
        beforeEach(() => {
          jest.spyOn(payviewStateManagementService, 'payViewState$', 'get').mockReturnValue(of(MOCK_PAYVIEW_STATE));
          fixture = TestBed.createComponent(FakeComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          fixture.detectChanges();
        });

        it('should show the summary block', () => {
          const summaryBlock = debugElement.query(By.css(payviewModalSummarySelector));

          expect(summaryBlock).toBeTruthy();
        });

        it('should show the summary overview component', () => {
          const summaryOverviewComponent = debugElement.query(By.css(payviewSummaryOverviewSelector));

          expect(summaryOverviewComponent).toBeTruthy();
        });

        it('should pass the payview state to the summary overview component', () => {
          const summaryOverviewComponent = debugElement.query(By.css(payviewSummaryOverviewSelector));

          expect((summaryOverviewComponent.componentInstance as PayviewSummaryOverviewComponent).payviewState).toEqual(MOCK_PAYVIEW_STATE);
        });
      });
    });
  });
});
