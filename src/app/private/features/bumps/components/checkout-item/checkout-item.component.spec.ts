import { of } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { CartService } from '@shared/catalog/cart/cart.service';
import { Cart } from '@shared/catalog/cart/cart';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';

describe('CheckoutItemComponent', () => {
  let component: CheckoutItemComponent;
  let fixture: ComponentFixture<CheckoutItemComponent>;
  let cartService: CartService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump',
  };
  const TYPE = 'citybump';
  const DURATION = '24';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutItemComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: CartService,
            useValue: {
              createInstance() {},
              add() {},
              remove() {},
              cart$: of(CART_CHANGE),
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutItemComponent);
    component = fixture.componentInstance;
    component.itemWithProducts = ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0];
    component.creditInfo = {
      currencyName: 'wallacoins',
      credit: 200,
      factor: 100,
    };
    fixture.detectChanges();
    cartService = TestBed.inject(CartService);
  });

  describe('ngOnInit', () => {
    describe('ngOnInit', () => {
      it('should call createInstance cartService method', () => {
        spyOn(cartService, 'createInstance').and.callThrough();

        component.ngOnInit();

        expect(cartService.createInstance).toHaveBeenCalledWith(new Cart());
      });
    });

    describe('should default products', () => {
      describe('and has not free products', () => {
        it('should set default products', () => {
          expect(component.availableTypes).toEqual(component.itemWithProducts.products);
          expect(component.selectedType).toEqual(component.itemWithProducts.products[0]);
          expect(component.availableDurations).toEqual(component.selectedType.durations);
          expect(component.selectedDuration).toEqual(component.selectedType.durations[component.selectedType.default_duration_index]);
        });
      });
    });

    /*     describe('onRemoveOrClean', () => {
      beforeEach(() => {
        component.selectedType = undefined;
        component.selectedDuration = undefined;
        component.ngOnInit();
      });

      it('should reset flags, selected type and duration if action remove', () => {
        const cartChange: CartChange = {
          action: 'remove',
          itemId: MOCK_ITEM_V3.id,
          cart: CART,
        };
        cartService.cart$ = of(cartChange);

        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('should reset flags, selected type and duration if action clean', () => {
        const cartChange: CartChange = {
          action: 'clean',
          cart: CART,
        };
        cartService.cart$ = of(cartChange);

        component.ngOnChanges();
        fixture.detectChanges();
      });

      afterEach(() => {
        expect(component.selectedType).toBeUndefined();
        expect(component.selectedDuration).toBeUndefined();
      });
    }); */
  });

  describe('ngOnDestroy', () => {
    it('should set active to false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    it('should call select method when creditInfo is changed and select value is not defined', fakeAsync(() => {
      spyOn(component, 'selectType').and.callThrough();
      component.creditInfo = {
        currencyName: 'yens',
        credit: 420,
        factor: 1337,
      };
      component.selectedType = null;

      component.ngOnChanges();
      tick();
      fixture.detectChanges();

      expect(component.selectType).toHaveBeenCalledTimes(1);
      expect(component.selectType).toHaveBeenCalledWith(component.itemWithProducts.products[0]);
      expect(component.selectedType).toBe(component.itemWithProducts.products[0]);
    }));
  });

  describe('select type', () => {
    beforeEach(() => {
      component.availableDurations = component.selectedType.durations;
      spyOn(cartService, 'add').and.callThrough();
      spyOn(cartService, 'remove').and.callThrough();

      component.selectType(component.availableTypes[0]);
    });

    it('should set type and duration', () => {
      expect(component.selectedType).toBe(component.availableTypes[0]);
      expect(component.selectedDuration).toBe(component.selectedType.durations[component.selectedType.default_duration_index]);
    });

    it('should call add', () => {
      expect(cartService.add).toHaveBeenCalledWith(
        {
          item: ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED[0].item,
          duration: component.selectedDuration,
          isFree: undefined,
          isProvincialBump: true,
        },
        component.selectedType.name
      );
    });
  });
});
