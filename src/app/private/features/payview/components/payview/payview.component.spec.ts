import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { DeliveryAddressApiService } from '@private/features/delivery/services/api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryBuyerCalculatorModule } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.module';
import { DeliveryBuyerModule } from '@api/bff/delivery/buyer/delivery-buyer.module';
import { DeliveryCostsModule } from '@api/bff/delivery/costs/delivery-costs.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemService } from '@core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentsCreditCardModule } from '@api/payments/cards';
import { PaymentsPaymentMethodsModule } from '@api/payments/payment-methods/payments-payment-methods.module';
import { PaymentsUserPaymentPreferencesModule } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.module';
import { PaymentsWalletsModule } from '@api/payments/wallets/payments-wallets.module';
import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

describe('PayviewComponent', () => {
  const fakeItemHash: string = 'this_is_a_fake_hash';

  let component: PayviewComponent;
  let fixture: ComponentFixture<PayviewComponent>;
  let itemHash: string;
  let modalService: NgbModal;
  let payviewStateManagement: PayviewStateManagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => fakeItemHash,
              },
            },
          },
        },
        DeliveryAddressService,
        DeliveryAddressApiService,
        DeliveryAddressStoreService,
        ItemService,
        PayviewService,
        PayviewStateManagementService,
      ],

      imports: [
        HttpClientTestingModule,
        BuyerRequestsApiModule,
        DeliveryBuyerModule,
        DeliveryBuyerCalculatorModule,
        DeliveryCostsModule,
        PaymentsCreditCardModule,
        PaymentsPaymentMethodsModule,
        PaymentsUserPaymentPreferencesModule,
        PaymentsWalletsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewComponent);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
    payviewStateManagement = TestBed.inject(PayviewStateManagementService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the Payview initializes...', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });
      payviewStateManagement.itemHash$.subscribe((result: string) => {
        itemHash = result;
      });

      fixture.detectChanges();
    });

    it('should open the payview overview component', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(PayviewModalComponent);
    });

    it('should set the item id passed as parameter', () => {
      expect(itemHash).toBe(fakeItemHash);
    });
  });
});
