import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutExtrasProItemComponent } from './checkout-extras-pro-item.component';
import { CartService } from '../../cart/cart.service';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createPacksFixture, PREPARED_PACKS } from '../../../../../tests/payments.fixtures.spec';
import { CartProExtrasPack } from '../../cart/cart-item.interface';

describe('CheckoutExtrasProItemComponent', () => {
  let component: CheckoutExtrasProItemComponent;
  let fixture: ComponentFixture<CheckoutExtrasProItemComponent>;
  let cartService: CartService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutExtrasProItemComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: CartService, useValue: {
            createInstance() { },
            addProExtras() { }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutExtrasProItemComponent);
    component = fixture.componentInstance;
    component.pack = PREPARED_PACKS[0];
    fixture.detectChanges();
    cartService = TestBed.get(CartService);
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new CartProExtras());
    });
  });

  describe('select', () => {
    it('should prepare cartProExtrasPack and call cartService addProExtras with pack selected', () => {
      spyOn(cartService, 'addProExtras').and.callThrough();
      const cartProExtrasPack: CartProExtrasPack = {
        pack: PREPARED_PACKS[0].packs[0]
      };

      component.select(PREPARED_PACKS[0].packs[0]);

      expect(cartService.addProExtras).toHaveBeenCalledWith(cartProExtrasPack, PREPARED_PACKS[0].packs[0].name.toLowerCase());
    });
  });
});
