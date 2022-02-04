import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import {
  MOCK_ACCEPT_SCREEN_PROPERTIES,
  MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { BehaviorSubject } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { DeliveryRadioSelectorComponent } from '@private/shared/delivery-radio-selector/delivery-radio-selector.component';
import { AcceptScreenCarrier } from '../../interfaces/accept-screen-carrier.interface';
import { DeliveryRadioOptionDirective } from '@private/shared/delivery-radio-selector/delivery-radio-option.directive';
import { ButtonComponent } from '@shared/button/button.component';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID: string = '82723gHYSA762';
  const acceptScreenPropertiesSubjectMock: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(null);
  const rejectButtonSelector: string = '#rejectButton';
  const acceptButtonSelector: string = '#acceptButton';

  let de: DebugElement;
  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenStoreService: AcceptScreenStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AcceptScreenModalComponent,
        ProductCardComponent,
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
            initialize() {},
            notifySelectedDropOffModeByUser() {},
            get properties$() {
              return acceptScreenPropertiesSubjectMock.asObservable();
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When opening Accept Screen', () => {
    describe('and we receive accept screen properties', () => {
      let acceptScreenProperties: AcceptScreenProperties;

      beforeEach(() => {
        spyOn(acceptScreenStoreService, 'initialize');

        acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES);

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

      it('should show reject button', () => {
        shouldRenderRejectButton(true);
      });

      it('should show accept button', () => {
        shouldRenderAcceptButton(true);
      });

      it('should update the component properties', () => {
        expect(acceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
      });

      describe('and we receive carriers', () => {
        const newCarrierSelectedPosition: number = 0;

        it('should update the selected drop off position', () => {
          const selectedDropOffPoint: number = MOCK_ACCEPT_SCREEN_PROPERTIES.carriers.findIndex(
            (carrier: AcceptScreenCarrier) => carrier.isSelected
          );
          expect(component.selectedDropOffPosition).toStrictEqual(selectedDropOffPoint);
        });

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

        describe('and the user selects another carrier', () => {
          beforeEach(() => {
            spyOn(acceptScreenStoreService, 'notifySelectedDropOffModeByUser').and.callThrough();
            fixture.debugElement
              .query(By.directive(DeliveryRadioSelectorComponent))
              .triggerEventHandler('selectedIdChanged', newCarrierSelectedPosition);
          });

          it('should notify the new carrier selected position ', () => {
            expect(acceptScreenStoreService.notifySelectedDropOffModeByUser).toHaveBeenCalledTimes(1);
            expect(acceptScreenStoreService.notifySelectedDropOffModeByUser).toHaveBeenCalledWith(newCarrierSelectedPosition);
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

        it('should NOT define the selected drop off position', () => {
          expect(component.selectedDropOffPosition).not.toBeDefined();
        });
      });
    });

    describe('and we receive accept screen properties but carriers with first option selected', () => {
      let acceptScreenProperties: AcceptScreenProperties;

      beforeEach(() => {
        acceptScreenPropertiesSubjectMock.next(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU);

        fixture.detectChanges();
        component.acceptScreenProperties$.subscribe((newProperties: AcceptScreenProperties) => {
          acceptScreenProperties = newProperties;
        });
      });

      it('should update the component properties', () => {
        expect(acceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU);
      });

      it('should update the selected drop off position', () => {
        const selectedDropOffPoint: number = MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers.findIndex(
          (carrier: AcceptScreenCarrier) => carrier.isSelected
        );
        expect(component.selectedDropOffPosition).toStrictEqual(selectedDropOffPoint);
      });

      it('should show carrier options', () => {
        shouldRenderRadioSelector(true);
      });

      it('should show carriers received', () => {
        const expectedCarriers: number = fixture.debugElement.queryAll(By.css('.AcceptScreenModal__carrierWrapper')).length;
        expect(expectedCarriers).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers.length);
      });

      describe.each(MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers)('for every carrier...', (carrier: AcceptScreenCarrier) => {
        const currentCarrierPosition: number = MOCK_ACCEPT_SCREEN_PROPERTIES_SELECTED_HPU.carriers.indexOf(carrier);

        describe('and the selected option is provided...', () => {
          shouldShowCarrierInformation(carrier, currentCarrierPosition);
        });
      });
    });

    describe('and we NOT receive accept screen properties', () => {
      let acceptScreenEmptyProperties: AcceptScreenProperties;

      beforeEach(() => {
        acceptScreenPropertiesSubjectMock.next(null);
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

      it('should NOT show reject button', () => {
        shouldRenderRejectButton(false);
      });

      it('should NOT show accept button', () => {
        shouldRenderAcceptButton(false);
      });

      it('should update the component properties', () => {
        expect(acceptScreenEmptyProperties).toStrictEqual(null);
      });

      it('should NOT show any carrier option', () => {
        shouldRenderRadioSelector(false);
      });
    });
  });

  function shouldInitializePropertiesWithStore(): void {
    expect(acceptScreenStoreService.initialize).toHaveBeenCalledTimes(1);
    expect(acceptScreenStoreService.initialize).toHaveBeenCalledWith(MOCK_REQUEST_ID);
  }

  function shouldRenderProductCard(isShowed: boolean): void {
    const productCard: DebugElement = fixture.debugElement.query(By.directive(ProductCardComponent));
    if (isShowed) {
      expect(productCard).toBeTruthy();
    } else {
      expect(productCard).toBeFalsy();
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
    it('should show the carrier image', () => {
      const carrierImage: DebugElement = de.queryAll(By.css('.AcceptScreenModal__carrierIcon'))[currentCarrierPosition];
      expect(carrierImage.nativeElement.src).toStrictEqual(carrier.icon);
    });

    it('should show the carrier title and price', () => {
      const carrierTitle: string = de.queryAll(By.css('#carrierTitle'))[currentCarrierPosition].nativeElement.innerHTML;
      expect(carrierTitle).toStrictEqual(`${carrier.title} <b>${carrier.price}</b>`);
    });

    if (carrier.isSelected) {
      it('should show first information when is provided', () => {
        const isFirstInfoShowed: boolean = de
          .queryAll(By.css('#carrierInformation'))
          .some((firstInformation) => firstInformation.nativeElement.innerHTML === carrier.information);

        if (carrier.information) {
          expect(isFirstInfoShowed).toBe(true);
        } else {
          expect(isFirstInfoShowed).toBe(false);
        }
      });

      it('should show secondary information when is provided', () => {
        const isSecondInfoShowed: boolean = de
          .queryAll(By.css('#carrierSecondaryInformation'))
          .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.secondaryInformation);

        if (carrier.secondaryInformation) {
          expect(isSecondInfoShowed).toBe(true);
        } else {
          expect(isSecondInfoShowed).toBe(false);
        }
      });

      it('should show carrier restrictions', () => {
        const areCarrierRestrictionsShowed: boolean = de
          .queryAll(By.css('.AcceptScreenModal__carrierRestrictions'))
          .some((secondInformation) => secondInformation.nativeElement.innerHTML === carrier.restrictions);

        expect(areCarrierRestrictionsShowed).toBe(true);
      });

      it('should should show button when needed', () => {
        const isButtonShowed: boolean = de
          .queryAll(By.directive(ButtonComponent))
          .some((button) => button.nativeElement.textContent === carrier.buttonProperties.text);

        if (carrier.buttonProperties.isShowed) {
          expect(isButtonShowed).toBe(true);
        } else {
          expect(isButtonShowed).toBe(false);
        }
      });
    } else {
      it('should NOT show any information', () => {
        const carrierInformationWrapper = fixture.debugElement.query(By.css('#carrierInformationWrapperSelector'));
        expect(carrierInformationWrapper).toBeFalsy();
      });
    }
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
});
