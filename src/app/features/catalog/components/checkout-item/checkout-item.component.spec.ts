import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CheckoutItemComponent } from './checkout-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { CITYBUMP_DURATIONS, ITEM_ID, ITEMS_WITH_PRODUCTS, ITEMS_WITH_PRODUCTS_PROVINCE, MOCK_ITEM_V3 } from '@fixtures/item.fixtures.spec';
import { CartService } from '@shared/catalog/cart/cart.service';
import { Cart } from '@shared/catalog/cart/cart';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';

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
    component.itemWithProducts = ITEMS_WITH_PRODUCTS[0];
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

    it('should set durations and default duration', () => {
      expect(component.durations).toEqual(['24', '72', '168']);
      expect(component.duration).toEqual('72');
    });

    it('should set provincialBump to true if no citybump', () => {
      component.itemWithProducts = ITEMS_WITH_PRODUCTS_PROVINCE[0];

      component.ngOnInit();

      expect(component.provincialBump).toBeTruthy();
    });

    describe('onRemoveOrClean', () => {
      beforeEach(() => {
        component.selectedType = TYPE;
        component.selectedDuration = DURATION;
      });

      it('should reset flags, selected type and duration if action remove', () => {
        const cartChange: CartChange = {
          action: 'remove',
          itemId: MOCK_ITEM_V3.id,
          cart: CART,
        };
        cartService.cart$ = of(cartChange);

        component.ngOnInit();
      });

      it('should reset flags, selected type and duration if action clean', () => {
        const cartChange: CartChange = {
          action: 'clean',
          cart: CART,
        };
        cartService.cart$ = of(cartChange);

        component.ngOnInit();
      });

      afterEach(() => {
        expect(component.selectedType).toBeUndefined();
        expect(component.selectedDuration).toBeUndefined();
        expect(component.itemWithProducts.item.flags.bump_type).toBeUndefined();
        expect(component.itemWithProducts.item.flags.bumped).toBeFalsy();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should set active to false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    it('should call select method when creditInfo is changed and select value is not defined', () => {
      spyOn(component, 'select');
      component.creditInfo = {
        currencyName: 'yens',
        credit: 420,
        factor: 1337,
      };
      component.selectedType = null;

      component.ngOnChanges();

      expect(component.selectedType).toBe(component.types[0]);
      expect(component.select).toHaveBeenCalledTimes(1);
      expect(component.select).toHaveBeenCalledWith(component.types[0]);
    });
  });

  describe('select', () => {
    beforeEach(() => {
      component.duration = DURATION;
      spyOn(cartService, 'add');
      spyOn(cartService, 'remove');

      component.select(TYPE);
    });

    it('should set type and duration', () => {
      expect(component.selectedType).toBe(TYPE);
      expect(component.selectedDuration).toBe(DURATION);
    });

    it('should call add', () => {
      expect(cartService.add).toHaveBeenCalledWith(
        {
          item: MOCK_ITEM_V3,
          duration: CITYBUMP_DURATIONS[0],
        },
        TYPE
      );
    });

    it('should set items flags', () => {
      expect(component.itemWithProducts.item.flags.bump_type).toBe(TYPE);
      expect(component.itemWithProducts.item.flags.bumped).toBeTruthy();
    });

    it('should call remove if selected twice', () => {
      component.select(TYPE);

      expect(cartService.remove).toHaveBeenCalledWith(MOCK_ITEM_V3.id, TYPE);
    });
  });

  describe('duration', () => {
    it('should call select method when changed and selectedType is defined', () => {
      spyOn(component, 'select');
      component.selectedType = TYPE;

      component.duration = DURATION;

      expect(component.select).toHaveBeenCalledTimes(1);
      expect(component.select).toHaveBeenCalledWith(TYPE);
    });

    it('should not call select method when changed and selectedType is null', () => {
      spyOn(component, 'select');
      component.selectedType = null;

      component.duration = DURATION;

      expect(component.select).toHaveBeenCalledTimes(0);
    });
  });
});
