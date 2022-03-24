import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement, Input, Output, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { BuyerRequestsApiModule } from '@api/delivery/buyer/requests/buyer-requests-api.module';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { ItemService } from '@core/item/item.service';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PaymentsPaymentMethod } from '@api/core/model/payments';
import { PaymentsWalletsHttpService } from '@api/payments/wallets/http/payments-wallets-http.service';
import { PaymentsWalletsService } from '@api/payments/wallets/payments-wallets.service';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';
import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PAYVIEW_STEPS } from '@private/features/payview/enums/payview-steps.enum';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';
import { PayviewPromotionEditorComponent } from '@private/features/payview/modules/promotion/components/editor/payview-promotion-editor.component';
import { PayviewPromotionOverviewComponent } from '@private/features/payview/modules/promotion/components/overview/payview-promotion-overview.component';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { StepperModule } from '@shared/stepper/stepper.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'tsl-delivery-address',
  template: '',
})
class FakeDeliveryAddressComponent {
  @Input() showTitle;
  @Input() whereUserComes;
}

@Component({
  selector: 'tsl-delivery-map',
  template: '',
})
class FakeDeliveryMapComponent {
  @Input() userOfficeId: number;
  @Input() selectedCarrier: unknown;
  @Input() fullAddress: string;
}

@Component({
  selector: 'tsl-fake-component',
  templateUrl: './payview-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FakeComponent extends PayviewModalComponent {
  constructor(
    payviewStateManagementService: PayviewStateManagementService,
    payviewDeliveryService: PayviewDeliveryService,
    activeModal: NgbActiveModal,
    customerHelpService: CustomerHelpService,
    deliveryCountries: DeliveryCountriesService,
    promotionService: PayviewPromotionService,
    paymentService: PayviewPaymentService
  ) {
    super(
      payviewStateManagementService,
      payviewDeliveryService,
      activeModal,
      customerHelpService,
      deliveryCountries,
      promotionService,
      paymentService
    );
  }
}

@Component({
  selector: 'tsl-payview-payment-overview',
  template: '',
})
class FakePayviewPaymentOverviewComponent {
  @Input() public card;
  @Input() public methods;
  @Input() public preferences;
}

describe('PayviewModalComponent', () => {
  const fakeHelpUrl: string = 'http://this_is_a_fake_help_url/';
  const fakeItemHash: string = 'This_is_a_fake_item_hash';

  const payviewModal: string = '.PayviewModal';
  const payviewModalCloseSelector: string = `${payviewModal}__close`;
  const payviewModalBackSelector: string = `${payviewModal}__back`;
  const payviewModalHelpSelector: string = '#helpLink';
  const payviewModalSpinnerSelector: string = `${payviewModal}__spinner`;
  const payviewModalSummarySelector: string = `${payviewModal}__summary`;
  const payviewModalDeliverySelector: string = `${payviewModal}__delivery`;
  const payviewModalPaymentSelector: string = `${payviewModal}__payment`;
  const payviewModalPickUpPointSelector: string = `${payviewModal}__pickUpPointMap`;
  const payviewModalPromotionSelector: string = `${payviewModal}__promotion`;
  const payviewDeliveryOverviewSelector: string = 'tsl-payview-delivery-overview';
  const payviewPromotionOverviewSelector: string = 'tsl-payview-promotion-overview';
  const payviewSummaryOverviewSelector: string = 'tsl-payview-summary-overview';

  let activeModalService: NgbActiveModal;
  let component: PayviewModalComponent;
  let customerHelpService: CustomerHelpService;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<FakeComponent>;
  let itemHashSpy: jest.SpyInstance;
  let payviewDeliveryService: PayviewDeliveryService;
  let payviewPaymentService: PayviewPaymentService;
  let payviewPromotionService: PayviewPromotionService;
  let payviewService: PayviewService;
  let payviewStateManagementService: PayviewStateManagementService;
  let stepper: StepperComponent;
  let stepperSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        FakeComponent,
        FakeDeliveryAddressComponent,
        FakeDeliveryMapComponent,
        FakePayviewPaymentOverviewComponent,
        PayviewDeliveryHeaderComponent,
        PayviewDeliveryOverviewComponent,
        PayviewDeliveryPointComponent,
        PayviewDeliveryPointsComponent,
        PayviewPromotionEditorComponent,
        PayviewPromotionOverviewComponent,
        PayviewSummaryCostDetailComponent,
        PayviewSummaryHeaderComponent,
        PayviewSummaryOverviewComponent,
        PayviewSummaryPaymentMethodComponent,
        SvgIconComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        BuyerRequestsApiModule,
        DeliveryRadioSelectorModule,
        FormsModule,
        HttpClientTestingModule,
        NgxPermissionsModule.forRoot(),
        StepperModule,
      ],
      providers: [
        {
          provide: CustomerHelpService,
          useValue: {
            getPageUrl() {
              return fakeHelpUrl;
            },
          },
        },
        DeliveryAddressService,
        DeliveryAddressStoreService,
        {
          provide: DeliveryCountriesService,
          useValue: {
            getCountriesAsOptionsAndDefault() {
              return of(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
            },
          },
        },
        ItemService,
        NgbActiveModal,
        PaymentsWalletsService,
        PaymentsWalletsHttpService,
        PayviewDeliveryService,
        PayviewPaymentService,
        PayviewPromotionService,
        PayviewStateManagementService,
        PayviewService,
      ],
    }).compileComponents();
  });

  describe('WHEN the component initializes', () => {
    beforeEach(() => {
      activeModalService = TestBed.inject(NgbActiveModal);
      customerHelpService = TestBed.inject(CustomerHelpService);
      payviewDeliveryService = TestBed.inject(PayviewDeliveryService);
      payviewPaymentService = TestBed.inject(PayviewPaymentService);
      payviewPromotionService = TestBed.inject(PayviewPromotionService);
      payviewService = TestBed.inject(PayviewService);
      payviewStateManagementService = TestBed.inject(PayviewStateManagementService);

      fixture = TestBed.createComponent(FakeComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      stepper = TestBed.createComponent(StepperComponent).componentInstance;

      fixture.detectChanges();

      component.stepper = stepper;
      stepperSpy = spyOn(stepper, 'goToStep');
      spyOn(customerHelpService, 'getPageUrl').and.callThrough();
      spyOn(activeModalService, 'close').and.callThrough();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the close button', () => {
      const target = debugElement.query(By.css(payviewModalCloseSelector));

      expect(target).toBeTruthy();
    });

    it('should show the help link', () => {
      const target = debugElement.query(By.css(payviewModalHelpSelector));

      expect(target).toBeTruthy();
    });

    it('should assign the corresponding help link', () => {
      const target = debugElement.query(By.css(payviewModalHelpSelector));

      expect((target.nativeElement as HTMLAnchorElement).href).toBe(fakeHelpUrl);
    });

    describe('WHEN user clicks the close button', () => {
      it('should close the modal window', () => {
        const target = fixture.debugElement.query(By.css(payviewModalCloseSelector)).nativeElement;

        target.click();

        expect(activeModalService.close).toHaveBeenCalledTimes(1);
      });
    });

    describe('AND WHEN the item has been reported', () => {
      beforeEach(() => {
        payviewStateManagementService = TestBed.inject(PayviewStateManagementService);
        itemHashSpy = jest.spyOn(payviewStateManagementService, 'itemHash', 'set');
        spyOn(payviewDeliveryService, 'on');

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

      it('should subscribe to all listeners', () => {
        expect(payviewDeliveryService.on).toHaveBeenCalledTimes(3);
      });

      describe('WHEN the payview gets the state', () => {
        beforeEach(fakeAsync(() => {
          jest.spyOn(payviewStateManagementService, 'payViewState$', 'get').mockReturnValue(of(MOCK_PAYVIEW_STATE));

          fixture = TestBed.createComponent(FakeComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;
          component.itemHash = fakeItemHash;

          tick();
          fixture.detectChanges();
        }));

        it('should show the summary block', () => {
          const summaryBlock = debugElement.query(By.css(payviewModalSummarySelector));

          expect(summaryBlock).toBeTruthy();
        });

        it('should show the delivery block', () => {
          const deliveryBlock = debugElement.query(By.css(payviewModalDeliverySelector));

          expect(deliveryBlock).toBeTruthy();
        });

        it('should show the promotion block', () => {
          const promotionBlock = debugElement.query(By.css(payviewModalPromotionSelector));

          expect(promotionBlock).toBeTruthy();
        });

        it('should show the payment block', () => {
          const paymentBlock = debugElement.query(By.css(payviewModalPaymentSelector));

          expect(paymentBlock).toBeTruthy();
        });

        it('should not show the loading animation', fakeAsync(() => {
          const loadingContainerRef = fixture.debugElement.query(By.css(payviewModalSpinnerSelector));
          expect(loadingContainerRef).toBeFalsy();
        }));

        it('should not show the delivery address', () => {
          const deliveryAddressComponent = debugElement.query(By.directive(FakeDeliveryAddressComponent));

          expect(deliveryAddressComponent).toBeFalsy();
        });

        it('should not show the pick-up block', () => {
          const pickUpPointMapBlock = debugElement.query(By.css(payviewModalPickUpPointSelector));

          expect(pickUpPointMapBlock).toBeFalsy();
        });

        it('should not show the promotion editor', () => {
          const promotionEditorComponent = debugElement.query(By.directive(PayviewPromotionEditorComponent));

          expect(promotionEditorComponent).toBeFalsy();
        });

        describe('WHEN stepper is on the second step', () => {
          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
          });

          it('should show the delivery address', () => {
            const deliveryAddressComponent = fixture.debugElement.query(By.directive(FakeDeliveryAddressComponent));

            expect(deliveryAddressComponent).toBeTruthy();
          });

          it('should assign the show title propery', () => {
            const deliveryAddressComponent: FakeDeliveryAddressComponent = fixture.debugElement.query(
              By.directive(FakeDeliveryAddressComponent)
            ).componentInstance;

            expect(deliveryAddressComponent.showTitle).toBeFalsy();
          });

          it('should assign the whereUserComes propery', () => {
            const deliveryAddressComponent: FakeDeliveryAddressComponent = fixture.debugElement.query(
              By.directive(FakeDeliveryAddressComponent)
            ).componentInstance;

            expect(deliveryAddressComponent.whereUserComes).toBe(DELIVERY_ADDRESS_PREVIOUS_PAGE.DELIVERY);
          });

          it('should not show the summary block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalSummarySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the delivery block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalDeliverySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the promotion block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalPromotionSelector));

            expect(target).toBeFalsy();
          });

          it('should not show the payment block', () => {
            const paymentBlock = debugElement.query(By.css(payviewModalPaymentSelector));

            expect(paymentBlock).toBeFalsy();
          });

          it('should not show the pick-up block', () => {
            const pickUpPointMapBlock = debugElement.query(By.css(payviewModalPickUpPointSelector));

            expect(pickUpPointMapBlock).toBeFalsy();
          });

          it('should not show the promotion editor', () => {
            const promotionEditorComponent = debugElement.query(By.directive(PayviewPromotionEditorComponent));

            expect(promotionEditorComponent).toBeFalsy();
          });
        });

        describe('WHEN stepper is on the third step', () => {
          let changeDetectorRef: ChangeDetectorRef;

          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
            changeDetectorRef = debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
          });

          it('should not show the summary block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalSummarySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the delivery block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalDeliverySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the promotion block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalPromotionSelector));

            expect(target).toBeFalsy();
          });

          it('should not show the payment block', () => {
            const paymentBlock = debugElement.query(By.css(payviewModalPaymentSelector));

            expect(paymentBlock).toBeFalsy();
          });

          it('should not show the delivery address', () => {
            const deliveryAddressComponent = fixture.debugElement.query(By.directive(FakeDeliveryAddressComponent));

            expect(deliveryAddressComponent).toBeFalsy();
          });

          it('should show the pick-up block', () => {
            const pickUpPointMapBlock = debugElement.query(By.css(payviewModalPickUpPointSelector));

            expect(pickUpPointMapBlock).toBeTruthy();
          });

          it('should show the pick-up map component', () => {
            const pickUpPointMapComponent: FakeDeliveryMapComponent = debugElement.query(
              By.directive(FakeDeliveryMapComponent)
            ).componentInstance;

            expect(pickUpPointMapComponent).toBeTruthy();
          });

          describe.each([['This_is_a_fake_address'], [null]])('WHEN assigning the full address', (expected) => {
            beforeEach(() => {
              let payviewState = { ...MOCK_PAYVIEW_STATE };
              payviewState.delivery.methods.addressLabel = expected;
              changeDetectorRef.detectChanges();
            });

            it('should assign the address label', () => {
              const pickUpPointMapComponent: FakeDeliveryMapComponent = debugElement.query(
                By.directive(FakeDeliveryMapComponent)
              ).componentInstance;

              expect(pickUpPointMapComponent.fullAddress).toBe(expected);
            });
          });

          describe.each([
            [POST_OFFICE_CARRIER.POSTE_ITALIANE, POST_OFFICE_CARRIER.POSTE_ITALIANE],
            [null, POST_OFFICE_CARRIER.CORREOS],
          ])('WHEN assigning the selected carrier', (carrier, expected) => {
            beforeEach(() => {
              let payviewState = { ...MOCK_PAYVIEW_STATE };
              payviewState.delivery.methods.current.carrier = carrier;
              changeDetectorRef.detectChanges();
            });

            it('should assign the selected carrier', () => {
              const pickUpPointMapComponent: FakeDeliveryMapComponent = debugElement.query(
                By.directive(FakeDeliveryMapComponent)
              ).componentInstance;

              expect(pickUpPointMapComponent.selectedCarrier).toBe(expected);
            });
          });

          describe.each([['This_is_a_user_office_id'], [null]])('WHEN assigning the selected user office id', (expected) => {
            beforeEach(() => {
              let payviewState = { ...MOCK_PAYVIEW_STATE };
              payviewState.delivery.methods.current.lastAddressUsed.id = expected;
              changeDetectorRef.detectChanges();
            });

            it('should assign the selected user office id', () => {
              const pickUpPointMapComponent: FakeDeliveryMapComponent = debugElement.query(
                By.directive(FakeDeliveryMapComponent)
              ).componentInstance;

              expect(pickUpPointMapComponent.userOfficeId).toBe(expected);
            });
          });

          it('should not show the promotion editor', () => {
            const promotionEditorComponent = debugElement.query(By.directive(PayviewPromotionEditorComponent));

            expect(promotionEditorComponent).toBeFalsy();
          });
        });

        describe('WHEN stepper is on the fourth step', () => {
          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.PROMOTION_EDITOR);
          });

          it('should not show the summary block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalSummarySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the delivery block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalDeliverySelector));

            expect(target).toBeFalsy();
          });

          it('should not show the promotion block', () => {
            const target = fixture.debugElement.query(By.css(payviewModalPromotionSelector));

            expect(target).toBeFalsy();
          });

          it('should not show the payment block', () => {
            const paymentBlock = debugElement.query(By.css(payviewModalPaymentSelector));

            expect(paymentBlock).toBeFalsy();
          });

          it('should not show the delivery address', () => {
            const deliveryAddressComponent = fixture.debugElement.query(By.directive(FakeDeliveryAddressComponent));

            expect(deliveryAddressComponent).toBeFalsy();
          });

          it('should not show the pick-up block', () => {
            const pickUpPointMapBlock = debugElement.query(By.css(payviewModalPickUpPointSelector));

            expect(pickUpPointMapBlock).toBeFalsy();
          });

          it('should show the promotion editor', () => {
            const promotionEditorComponent = debugElement.query(By.directive(PayviewPromotionEditorComponent));

            expect(promotionEditorComponent).toBeTruthy();
          });
        });

        describe('WHEN the user clicks over back button', () => {
          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
            spyOn(component.stepper, 'goToStep');

            fixture.detectChanges();
          });

          it('should redirect to the payview step', () => {
            const buttonBack = debugElement.query(By.css(payviewModalBackSelector));

            buttonBack.triggerEventHandler('click', null);

            expect(component.stepper.goToStep).toHaveBeenCalledTimes(1);
          });
        });

        describe('WHEN the user wants to edit the delivery address', () => {
          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
            spyOn(component.stepper, 'goToStep');

            fixture.detectChanges();
          });

          it('should redirect to the payview step', () => {
            const target: DebugElement = debugElement.query(By.directive(FakeDeliveryMapComponent));

            target.triggerEventHandler('goToDeliveryAddress', null);

            expect(component.stepper.goToStep).toHaveBeenCalledTimes(1);
            expect(component.stepper.goToStep).toHaveBeenCalledWith(PAYVIEW_STEPS.DELIVERY_ADDRESS);
          });
        });

        describe('WHEN the user has select a pick-up point', () => {
          beforeEach(() => {
            component.stepper.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
            spyOn(component.stepper, 'goToStep');
            spyOn(payviewStateManagementService, 'refreshByDelivery');

            fixture.detectChanges();
          });

          it('should redirect to the payview step', () => {
            const target: DebugElement = debugElement.query(By.directive(FakeDeliveryMapComponent));

            target.triggerEventHandler('selectedOfficeSucceeded', null);

            expect(component.stepper.goToStep).toHaveBeenCalledTimes(1);
            expect(component.stepper.goToStep).toHaveBeenCalledWith(PAYVIEW_STEPS.PAYVIEW);
          });

          it('should call to refresh the delivery information', () => {
            const target: DebugElement = debugElement.query(By.directive(FakeDeliveryMapComponent));

            target.triggerEventHandler('selectedOfficeSucceeded', null);

            expect(payviewStateManagementService.refreshByDelivery).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('WHEN the delivery method has been selected', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'setDeliveryMethod').and.callFake(() => {});
        spyOn(payviewDeliveryService, 'on').and.callThrough();
      });

      it('should set the delivery method received', () => {
        let result: DeliveryBuyerDeliveryMethod;
        const subscription = payviewDeliveryService.on(
          PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED,
          (data: DeliveryBuyerDeliveryMethod) => {
            result = data;
          }
        );

        payviewDeliveryService.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]);

        expect(payviewDeliveryService.on).toHaveBeenCalledTimes(1);
        expect(result).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]);
      });

      it('should call to set the delivery method received', () => {
        payviewDeliveryService.setDeliveryMethod(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]);

        expect(payviewStateManagementService.setDeliveryMethod).toHaveBeenCalledTimes(1);
        expect(payviewStateManagementService.setDeliveryMethod).toHaveBeenCalledWith(
          MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]
        );
      });
    });

    describe('WHEN the user wants to edit the delivery address', () => {
      beforeEach(() => {
        fixture.detectChanges();

        spyOn(payviewDeliveryService, 'on').and.callThrough();
      });

      it('should received the corresponding order', () => {
        let result: number = 0;
        let expected: number = 1;
        const subscription = payviewDeliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {
          result++;
        });

        payviewDeliveryService.editAddress();

        expect(payviewDeliveryService.on).toHaveBeenCalledTimes(1);
        expect(result).toBe(expected);
      });

      it('should move to the corresponding step', () => {
        const subscription = payviewDeliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {});

        payviewDeliveryService.editAddress();

        expect(stepperSpy).toHaveBeenCalledTimes(1);
        expect(stepperSpy).toHaveBeenCalledWith(PAYVIEW_STEPS.DELIVERY_ADDRESS);
      });
    });

    describe('WHEN the user wants to edit the pick-up point', () => {
      beforeEach(() => {
        spyOn(payviewDeliveryService, 'on').and.callThrough();
      });

      it('should received the corresponding order', () => {
        let result: number = 0;
        let expected: number = 1;
        const subscription = payviewDeliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {
          result++;
        });

        payviewDeliveryService.editPickUpPoint();

        expect(payviewDeliveryService.on).toHaveBeenCalledTimes(1);
        expect(result).toBe(expected);
      });

      it('should move to the corresponding step', () => {
        const subscription = payviewDeliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {});

        payviewDeliveryService.editPickUpPoint();

        expect(stepperSpy).toHaveBeenCalledTimes(1);
        expect(stepperSpy).toHaveBeenCalledWith(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
      });
    });

    describe('WHEN the user wants to edit the promocode', () => {
      beforeEach(() => {
        spyOn(payviewPromotionService, 'on').and.callThrough();
      });

      it('should received the corresponding order', () => {
        let result: number = 0;
        let expected: number = 1;
        const subscription = payviewPromotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {
          result++;
        });

        payviewPromotionService.openPromocodeEditor();

        expect(payviewPromotionService.on).toHaveBeenCalledTimes(1);
        expect(result).toBe(expected);
      });

      it('should move to the corresponding step', () => {
        const subscription = payviewPromotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {});

        payviewPromotionService.openPromocodeEditor();

        expect(stepperSpy).toHaveBeenCalledTimes(1);
        expect(stepperSpy).toHaveBeenCalledWith(PAYVIEW_STEPS.PROMOTION_EDITOR);
      });
    });

    describe('WHEN the user wants to apply a promocode', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'applyPromocode').and.callFake(() => {});
        spyOn(payviewPromotionService, 'on').and.callThrough();
      });

      it('should apply the promocode received', () => {
        let result: string;
        const fakePromocode: string = 'This_is_a_fake_promocode';
        const subscription = payviewPromotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.APPLY_PROMOCODE, (data: string) => {
          result = data;
        });

        payviewPromotionService.applyPromocode(fakePromocode);

        expect(payviewPromotionService.on).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePromocode);
      });

      it('should call to apply the promocode received', () => {
        const fakePromocode: string = 'This_is_a_fake_promocode';

        payviewPromotionService.applyPromocode(fakePromocode);

        expect(payviewStateManagementService.applyPromocode).toHaveBeenCalledTimes(1);
        expect(payviewStateManagementService.applyPromocode).toHaveBeenCalledWith(fakePromocode);
      });
    });

    describe('WHEN the user wants to remove a promocode', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'removePromocode').and.callFake(() => {});
        spyOn(payviewPromotionService, 'on').and.callThrough();
      });

      it('should remove the promocode received', () => {
        let result: number = 0;
        const fakePromocode: string = 'This_is_a_fake_promocode';
        const subscription = payviewPromotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.REMOVE_PROMOCODE, () => {
          result++;
        });

        payviewPromotionService.removePromocode();

        expect(payviewPromotionService.on).toHaveBeenCalledTimes(1);
        expect(result).toEqual(1);
      });

      it('should call to remove the promocode received', () => {
        const fakePromocode: string = 'This_is_a_fake_promocode';

        payviewPromotionService.removePromocode();

        expect(payviewStateManagementService.removePromocode).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN there is an error when applying a promocode', () => {
      beforeEach(() => {
        spyOn(payviewService, 'getCosts').and.returnValue(throwError('The Server is broken'));
        spyOn(payviewService, 'getCurrentState').and.returnValue(of(MOCK_PAYVIEW_STATE));
        spyOn(payviewStateManagementService, 'applyPromocode').and.callThrough();
        spyOn(payviewStateManagementService, 'on').and.callThrough();
        spyOn(payviewPromotionService, 'error').and.callThrough();

        payviewStateManagementService.itemHash = fakeItemHash;
      });

      it('should trigger the error', () => {
        const fakePromocode: string = 'This_is_a_fake_promocode';

        payviewStateManagementService.applyPromocode(fakePromocode);

        expect(payviewPromotionService.error).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the promocode has been apply', () => {
      beforeEach(() => {
        spyOn(payviewService, 'getCosts').and.returnValue(of(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS));
        spyOn(payviewService, 'getCurrentState').and.returnValue(of(MOCK_PAYVIEW_STATE));
        spyOn(payviewStateManagementService, 'applyPromocode').and.callThrough();
        spyOn(payviewStateManagementService, 'on').and.callThrough();

        payviewStateManagementService.itemHash = fakeItemHash;
      });

      it('should move to the payview step', () => {
        const fakePromocode: string = 'This_is_a_fake_promocode';

        payviewStateManagementService.applyPromocode(fakePromocode);

        expect(stepperSpy).toHaveBeenCalledTimes(1);
        expect(stepperSpy).toHaveBeenCalledWith(PAYVIEW_STEPS.PAYVIEW);
      });
    });

    describe('WHEN the delivery address has been saved', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'refreshByDelivery');
        component.closeDeliveryEditor();
      });

      it('should redirect to the payview step', () => {
        expect(stepper.goToStep).toHaveBeenCalledTimes(1);
      });

      it('should call to refresh the delivery information', () => {
        expect(payviewStateManagementService.refreshByDelivery).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the user wants to edit the credit card', () => {
      beforeEach(() => {
        fixture.detectChanges();

        spyOn(payviewPaymentService, 'on').and.callThrough();
      });

      it('should received the corresponding order', () => {
        let result: number = 0;
        let expected: number = 1;
        const subscription = payviewPaymentService.on(PAYVIEW_PAYMENT_EVENT_TYPE.OPEN_CREDIT_CARD, () => {
          result++;
        });

        payviewPaymentService.editCreditCard();

        expect(payviewPaymentService.on).toHaveBeenCalledTimes(1);
        expect(result).toBe(expected);
      });

      it('should move to the corresponding step', () => {
        const subscription = payviewPaymentService.on(PAYVIEW_PAYMENT_EVENT_TYPE.OPEN_CREDIT_CARD, () => {});

        payviewPaymentService.editCreditCard();

        expect(stepperSpy).toHaveBeenCalledTimes(1);
        expect(stepperSpy).toHaveBeenCalledWith(PAYVIEW_STEPS.CREDIT_CARD);
      });
    });

    describe('WHEN the credit card has been saved', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'refreshByCreditCard');
        component.closeCreditCardEditor();
      });

      it('should redirect to the payview step', () => {
        expect(stepper.goToStep).toHaveBeenCalledTimes(1);
        expect(stepper.goToStep).toHaveBeenCalledWith(PAYVIEW_STEPS.PAYVIEW);
      });

      it('should call to refresh the payment information', () => {
        expect(payviewStateManagementService.refreshByCreditCard).toHaveBeenCalledTimes(1);
      });
    });

    describe('WHEN the payment method has been selected', () => {
      beforeEach(() => {
        spyOn(payviewStateManagementService, 'setPaymentMethod').and.callFake(() => {});
        spyOn(payviewPaymentService, 'on').and.callThrough();
      });

      it('should set the payment method received', () => {
        let result: PaymentsPaymentMethod;
        const subscription = payviewPaymentService.on(PAYVIEW_PAYMENT_EVENT_TYPE.PAYMENT_METHOD_SELECTED, (data: PaymentsPaymentMethod) => {
          result = data;
        });

        payviewPaymentService.setPaymentMethod(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0]);

        expect(payviewPaymentService.on).toHaveBeenCalledTimes(1);
        expect(result).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0]);
      });

      it('should call to set the payment method received', () => {
        payviewPaymentService.setPaymentMethod(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0]);

        expect(payviewStateManagementService.setPaymentMethod).toHaveBeenCalledTimes(1);
        expect(payviewStateManagementService.setPaymentMethod).toHaveBeenCalledWith(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0]);
      });
    });

    describe('WHEN the components is destroyed', () => {
      beforeEach(() => {
        spyOn(payviewPromotionService, 'on').and.callThrough();
        component.ngOnDestroy();
      });

      it('should not received events anymore', () => {
        const subscription = payviewPromotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {});

        payviewPromotionService.openPromocodeEditor();

        expect(stepperSpy).not.toHaveBeenCalled();
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
        const loadingContainerRef = fixture.debugElement.query(By.css(payviewModalSpinnerSelector));
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

        it('should not show the summary overview component', () => {
          const summaryOverviewComponent = debugElement.query(By.css(payviewSummaryOverviewSelector));

          expect(summaryOverviewComponent).toBeFalsy();
        });

        it('should not show the delivery block', () => {
          const target = fixture.debugElement.query(By.css(payviewModalDeliverySelector));

          expect(target).toBeFalsy();
        });

        it('should not show the promotion block', () => {
          const target = fixture.debugElement.query(By.css(payviewModalPromotionSelector));

          expect(target).toBeFalsy();
        });

        it('should not show the payment block', () => {
          const paymentBlock = debugElement.query(By.css(payviewModalPaymentSelector));

          expect(paymentBlock).toBeFalsy();
        });

        it('should not show the delivery address', () => {
          const deliveryAddressComponent = fixture.debugElement.query(By.directive(FakeDeliveryAddressComponent));

          expect(deliveryAddressComponent).toBeFalsy();
        });

        it('should not show the pick-up block', () => {
          const pickUpPointMapBlock = debugElement.query(By.css(payviewModalPickUpPointSelector));

          expect(pickUpPointMapBlock).toBeFalsy();
        });

        it('should show the promotion editor', () => {
          const promotionEditorComponent = debugElement.query(By.directive(PayviewPromotionEditorComponent));

          expect(promotionEditorComponent).toBeFalsy();
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

        it('should show the delivery overview component', () => {
          const target = debugElement.query(By.css(payviewDeliveryOverviewSelector));

          expect(target).toBeTruthy();
        });

        it('should pass the costs to the delivery overview component', () => {
          const target = debugElement.query(By.css(payviewDeliveryOverviewSelector));

          expect((target.componentInstance as PayviewDeliveryOverviewComponent).costs).toEqual(MOCK_PAYVIEW_STATE.delivery.costs);
        });

        it('should pass the methods to the delivery overview component', () => {
          const target = debugElement.query(By.css(payviewDeliveryOverviewSelector));

          expect((target.componentInstance as PayviewDeliveryOverviewComponent).methods).toEqual(MOCK_PAYVIEW_STATE.delivery.methods);
        });

        it('should show the promotion overview component', () => {
          const target = debugElement.query(By.css(payviewPromotionOverviewSelector));

          expect(target).toBeTruthy();
        });

        it('should pass the costs to the promotion overview component', () => {
          const target = debugElement.query(By.css(payviewPromotionOverviewSelector));

          expect((target.componentInstance as PayviewPromotionOverviewComponent).costs).toEqual(MOCK_PAYVIEW_STATE.costs);
        });
      });
    });
  });
});
