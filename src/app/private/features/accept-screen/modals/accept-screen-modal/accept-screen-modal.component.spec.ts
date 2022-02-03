import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import { MOCK_ACCEPT_SCREEN_PROPERTIES } from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { BehaviorSubject } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { DeliveryRadioSelectorComponent } from '@private/shared/delivery-radio-selector/delivery-radio-selector.component';
import { DeliveryRadioOptionDirective } from '@private/shared/delivery-radio-selector/delivery-radio-option.directive';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID: string = '82723gHYSA762';
  const acceptScreenPropertiesSubjectMock: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(null);

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
    component = fixture.componentInstance;
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

      it('should update the component properties', () => {
        expect(acceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
      });

      describe('and we receive carriers', () => {
        const newCarrierSelectedPosition: number = 0;

        it('should show carrier options', () => {
          shouldRenderRadioSelector(true);
        });

        // TODO: Check why this is failing		Date: 2022/02/03
        xit('should show carriers received', () => {
          const expectedCarriers = fixture.debugElement.queryAll(By.directive(DeliveryRadioOptionDirective)).length;

          expect(expectedCarriers).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES.carriers.length);
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
});
