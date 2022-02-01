import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { of, ReplaySubject } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ACCEPT_SCREEN_DELIVERY_ADDRESS, ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { ACCEPT_SCREEN_ID_STEPS } from '../../constants/accept-screen-id-steps';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT } from '@fixtures/private/delivery/delivery-countries.fixtures.spec';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { DeliveryMethodSelectorComponent } from '@private/shared/components/delivery-method-selector/delivery-method-selector.component';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID: string = '82723gHYSA762';
  const sellerAddressHeaderStylesSelector: string = '.AcceptScreen__sellerAddressHeader--small';
  const fullAddressSelector: string = '#fullAddress';
  const acceptScreenPropertiesSubject: ReplaySubject<AcceptScreenProperties> = new ReplaySubject(1);
  const countriesAsOptionsAndDefaultSubject: ReplaySubject<CountryOptionsAndDefault> = new ReplaySubject(1);
  const deliveryAddressSelector = 'tsl-delivery-address';
  const MOCK_ACCEPT_SCREEN_HELP_URL = 'MOCK_ACCEPT_SCREEN_HELP_URL';

  let activeModal: NgbActiveModal;
  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenStoreService: AcceptScreenStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenModalComponent, ProductCardComponent, StepperComponent, StepDirective, DeliveryMethodSelectorComponent],
      providers: [
        {
          provide: AcceptScreenStoreService,
          useValue: {
            initialize() {},
            update() {},
            get properties$() {
              return acceptScreenPropertiesSubject.asObservable();
            },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenModalComponent);
    acceptScreenStoreService = TestBed.inject(AcceptScreenStoreService);
    component = fixture.componentInstance;
    component.requestId = MOCK_REQUEST_ID;
    activeModal = TestBed.inject(NgbActiveModal);
    acceptScreenPropertiesSubject.next(MOCK_ACCEPT_SCREEN_PROPERTIES);
    countriesAsOptionsAndDefaultSubject.next(MOCK_DELIVERY_COUNTRIES_OPTIONS_AND_DEFAULT);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When opening Accept Screen', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
    });

    describe('and we are on the accept screen step', () => {
      beforeEach(() => {
        component.stepper.activeId = ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN;
      });

      describe('the header...', () => {
        beforeEach(() => {
          fixture.detectChanges();
        });

        it('should NOT show the back arrow icon', () => {
          shouldShowArrowBackIcon(false);
        });

        it('should show the accept screen translated title', () => {
          shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN]);
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

        describe('and we click on the help button', () => {
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
          spyOn(acceptScreenStoreService, 'initialize');

          fixture.detectChanges();
          component.acceptScreenProperties$.subscribe((newProperties: AcceptScreenProperties) => {
            acceptScreenProperties = newProperties;
          });
        });

        it('should request accept screen properties using the store', () => {
          shouldInitializePropertiesWithStore();
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

        describe('and we click on the address button', () => {
          it('should redirect to address screen step', () => {
            const addressButton = fixture.debugElement.query(By.css('#addressButton')).nativeElement;

            addressButton.click();

            expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS);
          });
        });

        describe('and we receive the seller address', () => {
          it('should show the address', () => {
            const fullAddress: string = fixture.debugElement.query(By.css(fullAddressSelector)).nativeElement.innerHTML;

            expect(fullAddress).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES.seller.fullAddress);
          });

          it('should apply the small style in seller address header', () => {
            const sellerAddressHeaderSmallStyle: DebugElement = fixture.debugElement.query(By.css(sellerAddressHeaderStylesSelector));

            expect(sellerAddressHeaderSmallStyle).toBeTruthy();
          });

          it('should show the edit address button', () => {
            const editCopy: string = $localize`:@@accept_view_seller_sender_details_edit_button:Edit`;

            shouldShowDeliveryAddressButtonSpecificText(editCopy);
          });
        });

        describe('and we NOT receive the seller address', () => {
          beforeEach(() => {
            acceptScreenPropertiesSubject.next(MOCK_ACCEPT_SCREEN_PROPERTIES_WITHOUT_SELLER_ADDRESS);

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
      });

      describe('and we NOT receive accept screen properties', () => {
        let acceptScreenEmptyProperties: AcceptScreenProperties;

        beforeEach(() => {
          jest.spyOn(acceptScreenStoreService, 'properties$', 'get').mockReturnValue(of(null));
          spyOn(acceptScreenStoreService, 'initialize');

          fixture.detectChanges();
          component.acceptScreenProperties$.subscribe((newProperties: AcceptScreenProperties) => {
            acceptScreenEmptyProperties = newProperties;
          });
        });

        it('should request accept screen properties using the store', () => {
          shouldInitializePropertiesWithStore();
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
      });

      it('should detect the accept screen as active step', () => {
        expect(component.isAcceptScreenStep).toBeTruthy();
      });
    });

    describe('and we are on the address screen step', () => {
      beforeEach(() => {
        component.stepper.activeId = ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS;
        fixture.detectChanges();
      });

      describe('the header...', () => {
        it('should show the back arrow icon', () => {
          shouldShowArrowBackIcon(true);
        });

        it('should show the address screen translated title', () => {
          shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS]);
        });

        it('should NOT show help button', () => {
          shouldShowHelpButton(false);
        });

        it('should show the cross icon', () => {
          shouldShowCrossIcon();
        });

        describe('and we click on the back button', () => {
          it('should redirect to the accept screen step', () => {
            shouldMoveToPrincipalStepWhenBack();
          });
        });

        describe('and we click on the close button', () => {
          it('should close the modal', () => {
            shouldCloseModalWhenCrossClick();
          });
        });
      });

      describe('and we receive countries for the address screen', () => {
        it('should show the delivery address form', () => {
          shouldRenderDeliveryAddressForm(true);
        });

        describe('and the save delivery address succeed', () => {
          beforeEach(() => {
            const deliveryAddressComponent = fixture.debugElement.query(By.css(deliveryAddressSelector));

            deliveryAddressComponent.triggerEventHandler('addressSaveSucced', {});
          });

          it('should redirect to the accept screen step', () => {
            expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN);
            expect(component.isAcceptScreenStep).toBeTruthy();
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

      it('should not detect the accept screen as active step', () => {
        expect(component.isAcceptScreenStep).toBeFalsy();
      });
    });

    describe('and we are on the map step', () => {
      beforeEach(() => {
        component.stepper.activeId = ACCEPT_SCREEN_ID_STEPS.MAP;
        fixture.detectChanges();
      });

      describe('the header...', () => {
        it('should show the back arrow icon', () => {
          shouldShowArrowBackIcon(true);
        });

        it('should show the map translated title', () => {
          shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.MAP]);
        });

        it('should NOT show help button', () => {
          shouldShowHelpButton(false);
        });

        it('should show the cross icon', () => {
          shouldShowCrossIcon();
        });

        describe('and we click on the back button', () => {
          it('should redirect to the accept screen step', () => {
            shouldMoveToPrincipalStepWhenBack();
          });
        });

        describe('and we click on the close button', () => {
          it('should close the modal', () => {
            shouldCloseModalWhenCrossClick();
          });
        });
      });

      it('should not detect the accept screen as active step', () => {
        expect(component.isAcceptScreenStep).toBeFalsy();
      });
    });

    describe('and we are on the preference schedule step', () => {
      beforeEach(() => {
        component.stepper.activeId = ACCEPT_SCREEN_ID_STEPS.SCHEDULE;
        fixture.detectChanges();
      });

      describe('the header...', () => {
        it('should show the back arrow icon', () => {
          shouldShowArrowBackIcon(true);
        });

        it('should show the preference schedule translated title', () => {
          shouldShowSpecificHeaderText(ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.SCHEDULE]);
        });

        it('should NOT show help button', () => {
          shouldShowHelpButton(false);
        });

        it('should show the cross icon', () => {
          shouldShowCrossIcon();
        });

        describe('and we click on the back button', () => {
          it('should redirect to the accept screen step', () => {
            shouldMoveToPrincipalStepWhenBack();
          });
        });

        describe('and we click on the close button', () => {
          it('should close the modal', () => {
            shouldCloseModalWhenCrossClick();
          });
        });
      });

      it('should not detect the accept screen as active step', () => {
        expect(component.isAcceptScreenStep).toBeFalsy();
      });
    });
  });

  function shouldInitializePropertiesWithStore(): void {
    expect(acceptScreenStoreService.initialize).toHaveBeenCalledTimes(1);
    expect(acceptScreenStoreService.initialize).toHaveBeenCalledWith(MOCK_REQUEST_ID);
  }

  function shouldRenderProductCard(isShowed: boolean): void {
    const productCard = fixture.debugElement.query(By.directive(ProductCardComponent));
    if (isShowed) {
      expect(productCard).toBeTruthy();
    } else {
      expect(productCard).toBeFalsy();
    }
  }

  function shouldRenderAvailableDeliveryMethods(isShowed: boolean): void {
    const deliveryMethods = fixture.debugElement.query(By.directive(DeliveryMethodSelectorComponent));
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

  function shouldMoveToPrincipalStepWhenBack(): void {
    const backButton = fixture.debugElement.query(By.css('#back')).nativeElement;

    backButton.click();

    expect(component.stepper.activeId).toStrictEqual(ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN);
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
});
