import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptScreenModalComponent } from './accept-screen-modal.component';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import { MOCK_ACCEPT_SCREEN_PROPERTIES } from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { of } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AcceptScreenModalComponent', () => {
  const MOCK_REQUEST_ID: string = '82723gHYSA762';

  let component: AcceptScreenModalComponent;
  let fixture: ComponentFixture<AcceptScreenModalComponent>;
  let acceptScreenStoreService: AcceptScreenStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenModalComponent, ProductCardComponent],
      providers: [
        {
          provide: AcceptScreenStoreService,
          useValue: {
            initialize() {},
            get properties$() {
              return of(MOCK_ACCEPT_SCREEN_PROPERTIES);
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

      it('should update the component properties', () => {
        expect(acceptScreenEmptyProperties).toStrictEqual(null);
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
});
