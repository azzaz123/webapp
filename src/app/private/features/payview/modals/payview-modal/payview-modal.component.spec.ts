import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { ItemService } from '@core/item/item.service';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './payview-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FakeComponent extends PayviewModalComponent {
  constructor(payviewStateManagementService: PayviewStateManagementService) {
    super(payviewStateManagementService);
  }
}

describe('PayviewModalComponent', () => {
  const fakeItemHash: string = 'This_is_a_fake_item_hash';
  const payviewModalSummarySelector: string = '.PayviewModal_Summary';
  const payviewSummaryOverviewSelector: string = 'tsl-payview-summary-overview';

  let component: PayviewModalComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewModalComponent>;
  let itemHashSpy: jest.SpyInstance;
  let payviewStateManagementService: PayviewStateManagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FakeComponent, PayviewSummaryHeaderComponent, PayviewSummaryOverviewComponent, SvgIconComponent],
      imports: [HttpClientTestingModule, BuyerRequestsApiModule],
      providers: [
        DeliveryAddressService,
        DeliveryAddressStoreService,
        ItemService,
        NgbActiveModal,
        PaymentsWalletsService,
        PaymentsWalletsHttpService,
        PayviewStateManagementService,
      ],
    }).compileComponents();
  });

  describe('WHEN the component initializes', () => {
    describe('AND WHEN the item has been reported', () => {
      beforeEach(() => {
        payviewStateManagementService = TestBed.inject(PayviewStateManagementService);
        itemHashSpy = jest.spyOn(payviewStateManagementService, 'itemHash', 'set');

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
      });
    });
  });
});
