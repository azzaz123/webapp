import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProComponent } from './cart-pro.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { Observable } from 'rxjs/Observable';
import { CartPro } from '../../cart/cart-pro';
import { CartChange } from '../../cart/cart-item.interface';
import { ITEM_ID } from '../../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../../core/item/item.service';

describe('CartProComponent', () => {
  let component: CartProComponent;
  let fixture: ComponentFixture<CartProComponent>;

  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CartProComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: CartService, useValue: {
            cart$: Observable.of(CART_CHANGE),
            remove() {
            },
            clean() {
            },
            createInstance() {
            },
          }
        },
        {
          provide: ItemService, useValue: {
            purchaseProducts() {
              return Observable.of({});
            },
            deselectItems() {
            }
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
