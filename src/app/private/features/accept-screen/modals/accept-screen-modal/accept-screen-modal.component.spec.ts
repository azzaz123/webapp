import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_CARRIER_SELECTED,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_SCHEDULE_DEFINED_SECOND_SELECTED,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { of, ReplaySubject, BehaviorSubject, throwError } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { ACCEPT_SCREEN_STEPS } from '../../constants/accept-screen-steps';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { DeliveryRadioSelectorComponent } from '@private/shared/delivery-radio-selector/delivery-radio-selector.component';
import { AcceptScreenCarrier } from '../../interfaces/accept-screen-carrier.interface';
import { DeliveryRadioOptionDirective } from '@private/shared/delivery-radio-selector/delivery-radio-option.directive';
import { ButtonComponent } from '@shared/button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { Router } from '@angular/router';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery/carrier-drop-off-mode.type';
import { MOCK_ACCEPT_SCREEN_CARRIER_WITH_DELIVERY_PICK_UP_DAY } from '@fixtures/private/delivery/accept-screen/accept-screen-properties-carriers.fixtures.spec';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import {
  MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR,
  MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR,
} from '@fixtures/private/delivery/accept-screen/accept-screen-errors.fixtures.spec';

describe('AcceptScreenModalComponent', () => {
  const genericErrorTranslation: string = $localize`:@@accept_view_seller_all_all_snackbar_generic_error:¡Oops! Something has gone wrong. Try again.`;
  const acceptScreenPropertiesSubjectMock: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(null);
  const carrierSelectedIndexSubjectMock: BehaviorSubject<number> = new BehaviorSubject(1);
  const countriesAsOptionsAndDefaultSubject: ReplaySubject<CountryOptionsAndDefault> = new ReplaySubject(1);

  const MOCK_REQUEST_ID: string = '82723gHYSA762';
  const sellerAddressHeaderStylesSelector: string = '.AcceptScreenModal__sellerWithAddressHeader';
  const carrierButtonSelector: string = '.AcceptScreenModal__carrierButton';
  const spinnerSelector: string = '.AcceptScreenModal__spinner';
  const deliveryAddressSelector: string = 'tsl-delivery-address';
  const scheduleSelector: string = 'tsl-delivery-preference-schedule';
  const deliveryMapSelector: string = 'tsl-delivery-map';
  const fullAddressSelector: string = '#fullAddress';
  const rejectButtonSelector: string = '#rejectButton';
  const acceptButtonSelector: string = '#acceptButton';

  const MOCK_ACCEPT_SCREEN_HELP_URL = 'MOCK_ACCEPT_SCREEN_HELP_URL';

  let activeModal: NgbActiveModal;
  let de: DebugElement;
  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenStoreService: AcceptScreenStoreService;
  let modalService: NgbModal;
  let router: Router;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryRadioSelectorModule, RouterTestingModule],
      declarations: [
        AcceptScreenModalComponent,
        ProductCardComponent,
        StepperComponent,
        StepDirective,
        CustomCurrencyPipe,
        DeliveryRadioSelectorComponent,
        DeliveryRadioOptionDirective,
        ButtonComponent,
      ],
      providers: [
        DecimalPipe,
        {
          provide: AcceptScreenStoreService,
          useValue: {
            initialize() {
              return acceptScreenPropertiesSubjectMock.toPromise();
            },
            update() {
              return acceptScreenPropertiesSubjectMock.toPromise();
            },
            selectNewDropOffMode() {},
            get properties$() {
              return acceptScreenPropertiesSubjectMock.asObservable();
            },
            get carrierSelectedIndex$() {
              return carrierSelectedIndexSubjectMock.asObservable();
            },
            get carrierSelected$() {
              return of(MOCK_ACCEPT_SCREEN_CARRIER_WITH_DELIVERY_PICK_UP_DAY);
            },
            rejectRequest() {},
            acceptRequest() {},
          },
        },
        {
          provide: DeliveryCountriesService,
          useValue: {
            getCountriesAsOptionsAndDefault() {
              return countriesAsOptionsAndDefaultSubject.asObservable();
            },
          },
        },
        {
          provide: CustomerHelpService,
          useValue: {
            getPageUrl() {
              return MOCK_ACCEPT_SCREEN_HELP_URL;
            },
          },
        },
        NgbActiveModal,
        {
          provide: ToastService,
          useClass: MockToastService,
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve({}),
                componentInstance: {},
              };
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenModalComponent);
    acceptScreenStoreService = TestBed.inject(AcceptScreenStoreService);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.requestId = MOCK_REQUEST_ID;
    activeModal = TestBed.inject(NgbActiveModal);
    modalService = TestBed.inject(NgbModal);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When opening Accept Screen', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
    });

    describe('and we are on the accept screen step', () => {
      describe('the header...', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });

        it('should NOT show the back arrow icon', () => {
          shouldShowArrowBackIcon(false);
        });

        it('should show the accept screen translated title', () => {
          shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN]);
        });

        it('should show help button', () => {
          shouldShowHelpButton(true);
        });

        it('should show the cross icon', () => {
          shouldShowCrossIcon();
        });

        describe('and we click on the close button', () => {
          it('should close the modal', () => {
            shouldCloseModalWhenCrossClick();
          });
        });

        describe('the help button...', () => {
          let helpButtonRef: DebugElement;

          beforeEach(() => {
            helpButtonRef = fixture.debugElement.query(By.css('#help'));
            fixture.detectChanges();
          });

          it('should open the Accept Screen help page', () => {
            expect(component.ACCEPT_SCREEN_HELP_URL).toStrictEqual(MOCK_ACCEPT_SCREEN_HELP_URL);
            expect(helpButtonRef.attributes['href']).toStrictEqual(component.ACCEPT_SCREEN_HELP_URL);
          });
        });
      });

      describe('and we receive accept screen properties', () => {
        let acceptScreenProperties: AcceptScreenProperties;

        beforeEach(() => {
          spyOn(acceptScreenStoreService, 'initialize').and.callThrough();
          spyOn(acceptScreenStoreService, 'update').and.callThrough();
          acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES);

          fixture.detectChanges();
          component.acceptScreenProperties$.subscribe((newProperties: AcceptScreenProperties) => {
            acceptScreenProperties = newProperties;
          });
        });

        it('should call the store to initialize properties', () => {
          expect(acceptScreenStoreService.initialize).toHaveBeenCalledTimes(1);
          expect(acceptScreenStoreService.initialize).toHaveBeenCalledWith(MOCK_REQUEST_ID);
        });

        it('should detect the accept screen as active step', () => {
          shouldAcceptScreenActiveStep();
        });

        it('should show product card specifications', () => {
          shouldRenderProductCard(true);
        });

        it('should show available delivery method', () => {
          shouldRenderAvailableDeliveryMethods(true);
        });

        it('should show the seller avatar', () => {
          const sellerAvatar: DebugElement = fixture.debugElement.query(By.css('tsl-user-avatar'));

          expect(sellerAvatar).toBeTruthy();
          expect(sellerAvatar.nativeElement.imageUrl).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES.seller.imageUrl);
        });

        it('should update the component properties', () => {
          expect(acceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
        });

        it('should show product card specifications', () => {
          shouldRenderProductCard(true);
        });

        it('should show reject button', () => {
          shouldRenderRejectButton(true);
        });

        it('should show accept button', () => {
          shouldRenderAcceptButton(true);
        });

        it('should NOT show the loading spinner', () => {
          shouldRenderLoadingSpinner(false);
        });

        describe('and we receive the seller address', () => {
          it('should show the address', () => {
            const fullAddress: string = fixture.debugElement.query(By.css(fullAddressSelector)).nativeElement.innerHTML;

            expect(fullAddress).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress);
          });

          it('should apply the small style in seller address header', () => {
            const sellerAddressHeaderStyle: DebugElement = fixture.debugElement.query(By.css(sellerAddressHeaderStylesSelector));

            expect(sellerAddressHeaderStyle).toBeTruthy();
          });

          it('should show the edit address button', () => {
            const editCopy: string = $localize`:@@accept_view_seller_sender_details_edit_button:Edit`;

            shouldShowDeliveryAddressButtonSpecificText(editCopy);
          });
        });

        describe('and we NOT receive the seller address', () => {
          beforeEach(() => {
            acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS);

            fixture.detectChanges();
          });

          it('should NOT show the address', () => {
            const fullAddress: DebugElement = fixture.debugElement.query(By.css(fullAddressSelector));
            expect(fullAddress).toBeFalsy();
          });

          it('should NOT apply the small style in seller address header', () => {
            const sellerAddressHeaderSmallStyle: DebugElement = fixture.debugElement.query(By.css(sellerAddressHeaderStylesSelector));

            expect(sellerAddressHeaderSmallStyle).toBeFalsy();
          });

          it('should show the add address button', () => {
            const addCopy: string = $localize`:@@accept_view_seller_sender_details_add_button:Add`;

            shouldShowDeliveryAddressButtonSpecificText(addCopy);
          });
        });

        describe('and we receive carriers', () => {
          const newCarrierSelectedPosition: number = 0;

          it('should show carrier options', () => {
            shouldRenderRadioSelector(true);
          });

          it('should show carriers received', () => {
            const expectedCarriers: number = fixture.debugElement.queryAll(By.css('.AcceptScreenModal__carrierWrapper')).length;
            expect(expectedCarriers).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES.carriers.length);
          });

          describe.each(MOCK_ACCEPT_SCREEN_PROPERTIES.carriers)('for every carrier...', (carrier: AcceptScreenCarrier) => {
            const currentCarrierPosition: number = MOCK_ACCEPT_SCREEN_PROPERTIES.carriers.indexOf(carrier);

            describe('and the selected option is provided...', () => {
              shouldShowCarrierInformation(carrier, currentCarrierPosition);
            });
          });

          describe('and we click on the carrier button', () => {
            beforeEach(() => {
              spyOn(component.stepper, 'goToStep').and.callThrough();
            });

            describe('and we need to redirect to the map', () => {
              const MOCK_SELECTED_CARRIER_REDIRECT_STEP: ACCEPT_SCREEN_STEPS = MOCK_ACCEPT_SCREEN_PROPERTIES.carriers.find(
                (carrier) => carrier.isSelected
              ).buttonProperties.redirectStep;
              beforeEach(() => {
                const carrierButton = fixture.debugElement.query(By.css(carrierButtonSelector)).nativeElement;

                carrierButton.click();
                fixture.detectChanges();
              });

              it('should go to the provided step', () => {
                expect(component.stepper.goToStep).toHaveBeenCalledTimes(1);
                expect(component.stepper.goToStep).toHaveBeenCalledWith(MOCK_SELECTED_CARRIER_REDIRECT_STEP);
              });

              describe('the header...', () => {
                it('should show the back arrow icon', () => {
                  shouldShowArrowBackIcon(true);
                });

                it('should show the accept screen translated title', () => {
                  shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[MOCK_SELECTED_CARRIER_REDIRECT_STEP]);
                });

                it('should NOT show help button', () => {
                  shouldShowHelpButton(false);
                });

                it('should show the cross icon', () => {
                  shouldShowCrossIcon();
                });

                describe('and we click on the close button', () => {
                  it('should close the modal', () => {
                    shouldCloseModalWhenCrossClick();
                  });
                });
              });

              it('should redirect to map step', () => {
                expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.MAP);
              });

              it('should not detect the accept screen step as active', () => {
                expect(component.isAcceptScreenStep).toBe(false);
              });

              it('should show the map', () => {
                expect(fixture.debugElement.query(By.css(deliveryMapSelector))).toBeTruthy();
              });

              describe('and the user wants to change the delivery address', () => {
                beforeEach(() => {
                  fixture.debugElement.query(By.css(deliveryMapSelector)).triggerEventHandler('goToDeliveryAddress', {});

                  fixture.detectChanges();
                });

                it('should redirect to the delivery address step', () => {
                  expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS);
                });
              });

              describe('and the user selects an office', () => {
                beforeEach(() => {
                  fixture.debugElement.query(By.css(deliveryMapSelector)).triggerEventHandler('selectedOfficeSucceeded', {});

                  fixture.detectChanges();
                });

                it('should redirect to the accept screen step', () => {
                  expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN);
                });
              });
            });

            describe('and we need to redirect to the selection schedule preference', () => {
              let expectedDeliveryDay: string;
              const MOCK_SELECTED_CARRIER_REDIRECT_STEP: ACCEPT_SCREEN_STEPS =
                MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_SCHEDULE_DEFINED_SECOND_SELECTED.carriers.find((carrier) => carrier.isSelected)
                  .buttonProperties.redirectStep;
              beforeEach(() => {
                acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITH_SCHEDULE_DEFINED_SECOND_SELECTED);

                acceptScreenStoreService.carrierSelected$.subscribe(
                  (carrier: AcceptScreenCarrier) => (expectedDeliveryDay = carrier.deliveryPickUpDay)
                );
                fixture.detectChanges();
                const carrierButton = fixture.debugElement.query(By.css(carrierButtonSelector)).nativeElement;

                carrierButton.click();
                fixture.detectChanges();
              });

              it('should go to the provided step', () => {
                expect(component.stepper.goToStep).toHaveBeenCalledTimes(1);
                expect(component.stepper.goToStep).toHaveBeenCalledWith(MOCK_SELECTED_CARRIER_REDIRECT_STEP);
              });

              describe('and we get the delivery pick up day', () => {
                it('should return the store provided value', () => {
                  expect(expectedDeliveryDay).toStrictEqual(MOCK_ACCEPT_SCREEN_CARRIER_WITH_DELIVERY_PICK_UP_DAY.deliveryPickUpDay);
                });
              });

              describe('the header...', () => {
                it('should show the back arrow icon', () => {
                  shouldShowArrowBackIcon(true);
                });

                it('should show the accept screen translated title', () => {
                  shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[MOCK_SELECTED_CARRIER_REDIRECT_STEP]);
                });

                it('should NOT show help button', () => {
                  shouldShowHelpButton(false);
                });

                it('should show the cross icon', () => {
                  shouldShowCrossIcon();
                });

                describe('and we click on the close button', () => {
                  it('should close the modal', () => {
                    shouldCloseModalWhenCrossClick();
                  });
                });
              });

              it('should redirect to schedule step', () => {
                expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.SCHEDULE);
              });

              it('should not detect the accept screen step as active', () => {
                expect(component.isAcceptScreenStep).toBe(false);
              });

              it('should show the schedule', () => {
                expect(fixture.debugElement.query(By.css(scheduleSelector))).toBeTruthy();
              });
            });
          });

          describe('and the user selects another carrier', () => {
            beforeEach(() => {
              spyOn(acceptScreenStoreService, 'selectNewDropOffMode');

              fixture.debugElement
                .query(By.directive(DeliveryRadioSelectorComponent))
                .triggerEventHandler('changed', newCarrierSelectedPosition);
              acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU);
              carrierSelectedIndexSubjectMock.next(newCarrierSelectedPosition);

              fixture.detectChanges();
            });

            it('should notify the new carrier selected position ', () => {
              expect(acceptScreenStoreService.selectNewDropOffMode).toHaveBeenCalledTimes(1);
              expect(acceptScreenStoreService.selectNewDropOffMode).toHaveBeenCalledWith(newCarrierSelectedPosition);
            });

            describe.each(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers)('for every carrier...', (carrier: AcceptScreenCarrier) => {
              const currentCarrierPosition: number = MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers.indexOf(carrier);

              describe('and the selected option is provided...', () => {
                shouldShowCarrierInformation(carrier, currentCarrierPosition);
              });
            });
          });
        });

        describe('and we NOT receive carriers', () => {
          beforeEach(() => {
            acceptScreenPropertiesSubjectMock.next({ ...MOCK_ACCEPT_SCREEN_PROPERTIES, carriers: null });

            fixture.detectChanges();
          });

          it('should NOT show any carrier option', () => {
            shouldRenderRadioSelector(false);
          });
        });

        describe('and we click on the reject button', () => {
          describe('and we click on the confirm button', () => {
            beforeEach(() => {
              spyOn(modalService, 'open').and.callThrough();
            });

            describe('and the request is loading', () => {
              beforeEach(() => {
                const rejectButton: HTMLElement = fixture.debugElement.query(By.css(rejectButtonSelector)).nativeElement;

                rejectButton.click();
                fixture.detectChanges();
              });

              it('should show the reject button as disabled', () => {
                const rejectButtonDisabled: boolean = fixture.debugElement.query(By.css(rejectButtonSelector)).componentInstance.disabled;

                expect(rejectButtonDisabled).toBe(true);
              });

              it('should show the loading spinner', () => {
                const spinner: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));

                expect(spinner).toBeTruthy();
              });

              it('should show the confirm button as disabled', () => {
                const acceptButtonDisabled: boolean = fixture.debugElement.query(By.css(acceptButtonSelector)).componentInstance.disabled;

                expect(acceptButtonDisabled).toBe(true);
              });
            });

            describe('and the petition fails...', () => {
              beforeEach(() => {
                spyOn(acceptScreenStoreService, 'rejectRequest').and.returnValue(throwError('network error :P'));
                spyOn(toastService, 'show');
                const rejectButton = fixture.debugElement.query(By.css(rejectButtonSelector)).nativeElement;

                rejectButton.click();
              });

              it('should open the reject request modal', () => {
                expect(modalService.open).toHaveBeenCalledTimes(1);
                expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
              });

              it('should reject request', () => {
                expect(acceptScreenStoreService.rejectRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.rejectRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should NOT close the modal', () => {
                expect(activeModal.close).not.toHaveBeenCalled();
              });

              it('should show generic error message', () => {
                toastErrorShowed(genericErrorTranslation);
              });
            });

            describe('and the petition succeed', () => {
              beforeEach(() => {
                spyOn(router, 'navigate');
                spyOn(acceptScreenStoreService, 'rejectRequest').and.returnValue(of(null));
                const rejectButton = fixture.debugElement.query(By.css(rejectButtonSelector)).nativeElement;

                rejectButton.click();
              });

              it('should open the reject request modal', () => {
                expect(modalService.open).toHaveBeenCalledTimes(1);
                expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
              });

              it('should reject request', () => {
                expect(acceptScreenStoreService.rejectRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.rejectRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should redirect the user to the TTS', () => {
                expect(router.navigate).toHaveBeenCalledTimes(1);
                expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_REQUEST_ID}`]);
              });
            });
          });

          describe('and we click on the cancel button', () => {
            beforeEach(() => {
              spyOn(modalService, 'open').and.returnValue({ result: Promise.reject(), componentInstance: { ConfirmationModalComponent } });
              spyOn(acceptScreenStoreService, 'rejectRequest').and.returnValue(of(null));
              const rejectButton = fixture.debugElement.query(By.css(rejectButtonSelector)).nativeElement;

              rejectButton.click();
            });

            it('should open the reject request modal', () => {
              expect(modalService.open).toHaveBeenCalledTimes(1);
              expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
            });

            it('should not reject the request', () => {
              expect(acceptScreenStoreService.rejectRequest).not.toHaveBeenCalled();
            });
          });
        });

        describe('and we go to the address screen step', () => {
          beforeEach(() => {
            const addressButton = fixture.debugElement.query(By.css('#addressButton')).nativeElement;

            addressButton.click();
            fixture.detectChanges();
          });

          it('should redirect to address screen step', () => {
            expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS);
          });

          it('should not detect the accept screen as active step', () => {
            expect(component.isAcceptScreenStep).toBeFalsy();
          });

          it('should NOT update the accept screen properties', () => {
            shouldUpdateTheAcceptScreenProperties(false);
          });

          describe('the header...', () => {
            it('should show the back arrow icon', () => {
              shouldShowArrowBackIcon(true);
            });

            it('should show the address screen translated title', () => {
              shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS]);
            });

            it('should NOT show help button', () => {
              shouldShowHelpButton(false);
            });

            it('should show the cross icon', () => {
              shouldShowCrossIcon();
            });

            describe('and we click on the back button', () => {
              beforeEach(() => {
                const backButton = fixture.debugElement.query(By.css('#back')).nativeElement;

                backButton.click();
              });

              it('should redirect to the accept screen step', () => {
                shouldAcceptScreenActiveStep();
              });

              it('should update the accept screen properties requesting it again', () => {
                shouldUpdateTheAcceptScreenProperties(true);
              });
            });

            describe('and we click on the close button', () => {
              it('should close the modal', () => {
                shouldCloseModalWhenCrossClick();
              });
            });
          });

          describe('and we receive countries for the address screen', () => {
            beforeEach(() => {
              countriesAsOptionsAndDefaultSubject.next(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);

              fixture.detectChanges();
            });

            it('should show the delivery address form', () => {
              shouldRenderDeliveryAddressForm(true);
            });

            describe('and the save delivery address succeed', () => {
              beforeEach(() => {
                const deliveryAddressComponent = fixture.debugElement.query(By.css(deliveryAddressSelector));

                deliveryAddressComponent.triggerEventHandler('addressSaveSucceded', {});
              });

              it('should redirect to the accept screen step', () => {
                shouldAcceptScreenActiveStep();
              });

              it('should update the accept screen properties requesting it again', () => {
                shouldUpdateTheAcceptScreenProperties(true);
              });
            });
          });

          describe(`and we DON'T receive countries for the address screen`, () => {
            beforeEach(() => {
              countriesAsOptionsAndDefaultSubject.next(null);

              fixture.detectChanges();
            });

            it('should NOT show the delivery address form', () => {
              shouldRenderDeliveryAddressForm(false);
            });
          });
        });

        describe('and we click on the confirm button', () => {
          beforeEach(() => {
            spyOn(toastService, 'show');
          });

          describe('and the request is loading', () => {
            beforeEach(() => {
              const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

              acceptButton.click();
              fixture.detectChanges();
            });

            it('should show the confirm button as disabled', () => {
              const acceptButtonDisabled: boolean = fixture.debugElement.query(By.css(acceptButtonSelector)).componentInstance.disabled;

              expect(acceptButtonDisabled).toBe(true);
            });

            it('should show the confirm button with a loading spinner', () => {
              const acceptButtonLoading: boolean = fixture.debugElement.query(By.css(acceptButtonSelector)).componentInstance.loading;

              expect(acceptButtonLoading).toBe(true);
            });

            it('should show the reject button as disabled', () => {
              const acceptButtonLoading: boolean = fixture.debugElement.query(By.css(rejectButtonSelector)).componentInstance.disabled;

              expect(acceptButtonLoading).toBe(true);
            });
          });

          describe('and the request finished', () => {
            beforeEach(() => {
              component.confirmLoadingButton$.next(false);
              component.disableButton$.next(false);
              fixture.detectChanges();
            });

            it('should NOT show the confirm button disabled', () => {
              const acceptButtonDisabled: boolean = fixture.debugElement.query(By.css(acceptButtonSelector)).componentInstance.disabled;

              expect(acceptButtonDisabled).toBe(false);
            });

            it('should NOT show the confirm button with a loading spinner', () => {
              const acceptButtonLoading: boolean = fixture.debugElement.query(By.css(acceptButtonSelector)).componentInstance.loading;

              expect(acceptButtonLoading).toBe(false);
            });

            it('should NOT show the reject button disabled', () => {
              const acceptButtonLoading: boolean = fixture.debugElement.query(By.css(rejectButtonSelector)).componentInstance.disabled;

              expect(acceptButtonLoading).toBe(false);
            });
          });

          describe(`and we don't have a carrier selected`, () => {
            beforeEach(() => {
              spyOn(acceptScreenStoreService, 'acceptRequest').and.callThrough();
              carrierSelectedIndexSubjectMock.next(CARRIER_DROP_OFF_MODE.POST_OFFICE);
              acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_CARRIER_SELECTED);

              const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

              acceptButton.click();
            });

            it('should NOT call the server', () => {
              expect(acceptScreenStoreService.acceptRequest).not.toHaveBeenCalled();
            });

            it('should show an specific error message', () => {
              const SELECT_CARRIER_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_pending_shipping_method_error:Please select how you'll send the package.`;
              toastErrorShowed(SELECT_CARRIER_ERROR_TRANSLATION);
            });
          });

          describe(`and we don't have the seller delivery address`, () => {
            beforeEach(() => {
              spyOn(acceptScreenStoreService, 'acceptRequest').and.callThrough();
              carrierSelectedIndexSubjectMock.next(CARRIER_DROP_OFF_MODE.POST_OFFICE);
              acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS);

              const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

              acceptButton.click();
            });

            it('should NOT call the server', () => {
              expect(acceptScreenStoreService.acceptRequest).not.toHaveBeenCalled();
            });

            it('should show an specific error message', () => {
              const MISSING_SELLER_ADDRESS_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_pending_sender_details_error:Please enter the sender address.`;
              toastErrorShowed(MISSING_SELLER_ADDRESS_ERROR_TRANSLATION);
            });
          });

          describe('and the selected drop off mode is post office', () => {
            beforeEach(() => {
              carrierSelectedIndexSubjectMock.next(CARRIER_DROP_OFF_MODE.POST_OFFICE);
            });

            describe('and the petition fails...', () => {
              beforeEach(() => {
                spyOn(acceptScreenStoreService, 'acceptRequest').and.returnValue(
                  throwError([MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR])
                );
                const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

                acceptButton.click();
              });

              it('should call to server to accept request', () => {
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should show specific error message', () => {
                toastErrorShowed(MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR.message);
              });
            });

            describe('and the petition succeeds', () => {
              beforeEach(() => {
                spyOn(router, 'navigate');
                spyOn(acceptScreenStoreService, 'acceptRequest').and.returnValue(of(null));
                const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

                acceptButton.click();
              });

              it('should accept request', () => {
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should redirect the user to the TTS', () => {
                expect(router.navigate).toHaveBeenCalledTimes(1);
                expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_REQUEST_ID}`]);
              });
            });
          });

          describe('and the selected drop off mode is HOME PICK UP', () => {
            beforeEach(() => {
              carrierSelectedIndexSubjectMock.next(CARRIER_DROP_OFF_MODE.HOME_PICK_UP);
            });

            describe('and the petition fails...', () => {
              beforeEach(() => {
                spyOn(acceptScreenStoreService, 'acceptRequest').and.returnValue(
                  throwError([MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR])
                );
                const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

                acceptButton.click();
              });

              it('should call to server to accept request', () => {
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should show specific error message', () => {
                toastErrorShowed(MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR.message);
              });
            });

            describe('and the petition succeeds', () => {
              beforeEach(() => {
                spyOn(router, 'navigate');
                spyOn(acceptScreenStoreService, 'acceptRequest').and.returnValue(of(null));
                const acceptButton: HTMLElement = fixture.debugElement.query(By.css(acceptButtonSelector)).nativeElement;

                acceptButton.click();
              });

              it('should accept request', () => {
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledTimes(1);
                expect(acceptScreenStoreService.acceptRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
              });

              it('should redirect the user to the TTS', () => {
                expect(router.navigate).toHaveBeenCalledTimes(1);
                expect(router.navigate).toHaveBeenCalledWith([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${MOCK_REQUEST_ID}`]);
              });
            });
          });
        });
      });

      describe('and we NOT receive accept screen properties', () => {
        let acceptScreenEmptyProperties: AcceptScreenProperties;

        beforeEach(() => {
          acceptScreenPropertiesSubjectMock.next(null);
          spyOn(toastService, 'show');
          spyOn(acceptScreenStoreService, 'initialize').and.returnValue(Promise.reject());
          spyOn(acceptScreenStoreService, 'update').and.callThrough();

          fixture.detectChanges();
          component.acceptScreenProperties$.subscribe((newProperties: AcceptScreenProperties) => {
            acceptScreenEmptyProperties = newProperties;
          });
        });

        it('should show the loading spinner', () => {
          shouldRenderLoadingSpinner(true);
        });

        it('should NOT show product card specifications', () => {
          shouldRenderProductCard(false);
        });

        it('should NOT show available delivery method', () => {
          shouldRenderAvailableDeliveryMethods(false);
        });

        it('should not show seller address section', () => {
          const sellerAddressSection: DebugElement = fixture.debugElement.query(By.css('#sellerAddressSection'));
          expect(sellerAddressSection).toBeFalsy();
        });

        it('should update the component properties', () => {
          expect(acceptScreenEmptyProperties).toStrictEqual(null);
        });

        it('should close the modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
        });

        it('should show generic error message', () => {
          toastErrorShowed(genericErrorTranslation);
        });
      });
    });
  });

  function shouldRenderProductCard(isShowed: boolean): void {
    const productCard: DebugElement = fixture.debugElement.query(By.directive(ProductCardComponent));
    if (isShowed) {
      expect(productCard).toBeTruthy();
    } else {
      expect(productCard).toBeFalsy();
    }
  }

  function shouldRenderAvailableDeliveryMethods(isShowed: boolean): void {
    const deliveryMethods = fixture.debugElement.query(By.directive(DeliveryRadioSelectorComponent));
    if (isShowed) {
      expect(deliveryMethods).toBeTruthy();
    } else {
      expect(deliveryMethods).toBeFalsy();
    }
  }

  function shouldShowSpecificHeaderText(expectedText: string): void {
    const headerText: string = fixture.debugElement.query(By.css('#headerText')).nativeElement.innerHTML;

    expect(headerText).toStrictEqual(expectedText);
  }

  function shouldShowCrossIcon(): void {
    const cross: DebugElement = fixture.debugElement.query(By.css('#cross'));
    expect(cross).toBeTruthy();
  }

  function shouldShowArrowBackIcon(isShowed: boolean): void {
    const arrowBack: DebugElement = fixture.debugElement.query(By.css('#back'));
    if (isShowed) {
      expect(arrowBack).toBeTruthy();
    } else {
      expect(arrowBack).toBeFalsy();
    }
  }

  function shouldShowHelpButton(isShowed: boolean): void {
    const help: DebugElement = fixture.debugElement.query(By.css('#help'));
    if (isShowed) {
      expect(help).toBeTruthy();
    } else {
      expect(help).toBeFalsy();
    }
  }

  function shouldUpdateTheAcceptScreenProperties(shouldBeUpdated: boolean): void {
    if (shouldBeUpdated) {
      expect(acceptScreenStoreService.update).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      expect(acceptScreenStoreService.update).toHaveBeenCalledTimes(1);
    } else {
      expect(acceptScreenStoreService.update).not.toHaveBeenCalled();
    }
  }

  function shouldAcceptScreenActiveStep(): void {
    expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN);
    expect(component.isAcceptScreenStep).toBeTruthy();
  }

  function shouldCloseModalWhenCrossClick(): void {
    const crossButton = fixture.debugElement.query(By.css('#cross')).nativeElement;

    crossButton.click();

    expect(activeModal.close).toHaveBeenCalledTimes(1);
  }

  function shouldShowDeliveryAddressButtonSpecificText(expectedText: string): void {
    const buttonText: string = fixture.debugElement.query(By.css('#addressButtonCopy')).nativeElement.innerHTML;

    expect(buttonText).toStrictEqual(expectedText);
  }

  function shouldRenderDeliveryAddressForm(isShowed: boolean): void {
    const deliveryAddressForm = fixture.debugElement.query(By.css(deliveryAddressSelector));
    if (isShowed) {
      expect(deliveryAddressForm).toBeTruthy();
    } else {
      expect(deliveryAddressForm).toBeFalsy();
    }
  }

  function shouldRenderRadioSelector(isShowed: boolean): void {
    const radioSelector: DebugElement = fixture.debugElement.query(By.directive(DeliveryRadioSelectorComponent));
    if (isShowed) {
      expect(radioSelector).toBeTruthy();
    } else {
      expect(radioSelector).toBeFalsy();
    }
  }

  function shouldShowCarrierInformation(carrier: AcceptScreenCarrier, currentCarrierPosition: number): void {
    const firstInformationSelector = '.carrierInformation';
    const secondInformationSelector = '.carrierSecondaryInformation';
    const restrictionsInformationSelector = '.AcceptScreenModal__carrierRestrictions';

    it('should show the carrier image', () => {
      const carrierImage: DebugElement = de.queryAll(By.css('.AcceptScreenModal__carrierIcon'))[currentCarrierPosition];
      expect(carrierImage.nativeElement.src).toStrictEqual(carrier.icon);
    });

    it('should show the carrier title and price', () => {
      const carrierTitle: string = de.queryAll(By.css('.carrierTitle'))[currentCarrierPosition].nativeElement.innerHTML;
      expect(carrierTitle).toStrictEqual(`${carrier.title} <b>${carrier.price}</b>`);
    });

    if (carrier.isSelected) {
      describe('when the carrier is selected', () => {
        it('should show first information when is provided', () => {
          const isFirstInfoShowed: boolean = de
            .queryAll(By.css(firstInformationSelector))
            .some((firstInformation) => firstInformation.nativeElement.innerHTML === carrier.information);

          if (carrier.information) {
            expect(isFirstInfoShowed).toBe(true);
          } else {
            expect(isFirstInfoShowed).toBe(false);
          }
        });

        it('should show secondary information when is provided', () => {
          const isSecondInfoShowed: boolean = de
            .queryAll(By.css(secondInformationSelector))
            .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.secondaryInformation);

          if (carrier.secondaryInformation) {
            expect(isSecondInfoShowed).toBe(true);
          } else {
            expect(isSecondInfoShowed).toBe(false);
          }
        });

        it('should show carrier restrictions', () => {
          const areCarrierRestrictionsShowed: boolean = de
            .queryAll(By.css(restrictionsInformationSelector))
            .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.restrictions);

          expect(areCarrierRestrictionsShowed).toBe(true);
        });

        it('should should show button when needed', () => {
          const isButtonShowed: boolean = de
            .queryAll(By.css(carrierButtonSelector))
            .some((button) => button.nativeElement.textContent === carrier.buttonProperties.text);

          if (carrier.buttonProperties.isShowed) {
            expect(isButtonShowed).toBe(true);
          } else {
            expect(isButtonShowed).toBe(false);
          }
        });
      });
    } else {
      describe('when the carrier is NOT selected', () => {
        it('should NOT show first information', () => {
          const isFirstInfoShowed: boolean = de
            .queryAll(By.css(firstInformationSelector))
            .some((firstInformation) => firstInformation.nativeElement.innerHTML === carrier.information);

          expect(isFirstInfoShowed).toBe(false);
        });

        it('should NOT show secondary information', () => {
          const isSecondInfoShowed: boolean = de
            .queryAll(By.css(secondInformationSelector))
            .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.secondaryInformation);

          expect(isSecondInfoShowed).toBe(false);
        });

        it('should NOT show carrier restrictions', () => {
          const areCarrierRestrictionsShowed: boolean = de
            .queryAll(By.css(restrictionsInformationSelector))
            .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.restrictions);

          expect(areCarrierRestrictionsShowed).toBe(false);
        });
      });
    }
  }

  function toastErrorShowed(text: string): void {
    expect(toastService.show).toHaveBeenCalledTimes(1);
    expect(toastService.show).toHaveBeenCalledWith({ text, type: TOAST_TYPES.ERROR });
  }

  function shouldRenderRejectButton(isShowed: boolean): void {
    if (isShowed) {
      expect(de.nativeElement.querySelector(rejectButtonSelector)).toBeTruthy();
    } else {
      expect(de.nativeElement.querySelector(rejectButtonSelector)).toBeFalsy();
    }
  }

  function shouldRenderAcceptButton(isShowed: boolean): void {
    if (isShowed) {
      expect(de.nativeElement.querySelector(acceptButtonSelector)).toBeTruthy();
    } else {
      expect(de.nativeElement.querySelector(acceptButtonSelector)).toBeFalsy();
    }
  }

  function shouldRenderLoadingSpinner(isShowed: boolean): void {
    if (isShowed) {
      expect(de.nativeElement.querySelector(spinnerSelector)).toBeTruthy();
    } else {
      expect(de.nativeElement.querySelector(spinnerSelector)).toBeFalsy();
    }
  }
});
