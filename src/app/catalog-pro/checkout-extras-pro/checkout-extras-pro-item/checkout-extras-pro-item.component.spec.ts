import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckoutExtrasProItemComponent } from './checkout-extras-pro-item.component';
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CustomCurrencyPipe } from '../../../shared/pipes';
import { PREPARED_PACKS } from '../../../../tests/payments.fixtures.spec';
import { CartProExtras } from '../../../shared/catalog/cart/cart-pro-extras';
import { CartProExtrasPack } from '../../../shared/catalog/cart/cart-item.interface';

describe('CheckoutExtrasProItemComponent', () => {
  let component: CheckoutExtrasProItemComponent;
  let fixture: ComponentFixture<CheckoutExtrasProItemComponent>;
  let cartService: CartService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutExtrasProItemComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: CartService,
            useValue: {
              createInstance() {},
              addProExtras() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutExtrasProItemComponent);
    component = fixture.componentInstance;
    component.pack = PREPARED_PACKS[0];
    fixture.detectChanges();
    cartService = TestBed.inject(CartService);
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(
        new CartProExtras()
      );
    });
  });

  describe('select', () => {
    it('should prepare cartProExtrasPack and call cartService addProExtras with pack selected', () => {
      spyOn(cartService, 'addProExtras').and.callThrough();
      const cartProExtrasPack: CartProExtrasPack = {
        pack: PREPARED_PACKS[0].packs[0],
      };

      component.select(PREPARED_PACKS[0].packs[0]);

      expect(cartService.addProExtras).toHaveBeenCalledWith(
        cartProExtrasPack,
        PREPARED_PACKS[0].packs[0].name.toLowerCase()
      );
    });
  });
});
