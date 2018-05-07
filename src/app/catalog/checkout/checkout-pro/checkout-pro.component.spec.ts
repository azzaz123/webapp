import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckoutProComponent } from './checkout-pro.component';
import { ItemService } from '../../../core/item/item.service';
import { ITEMS_WITH_PRODUCTS, ITEM_ID } from '../../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CartPro } from '../cart/cart-pro';
import { CartChange } from '../cart/cart-item.interface';

describe('CheckoutProComponent', () => {
  let component: CheckoutProComponent;
  let fixture: ComponentFixture<CheckoutProComponent>;

  const SELECTED_ITEMS = ['1', '2', '3'];
  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutProComponent],
      providers: [
        {
          provide: ItemService, useValue: {
            selectedItems: SELECTED_ITEMS,
            getItemsWithAvailableProducts() {
              return Observable.of(ITEMS_WITH_PRODUCTS);
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        {
          provide: CartService, useValue: {
            createInstance() {
              return new CartPro();
            },
            add() {
            },
            remove() {
            },
            cart$: Observable.of(CART_CHANGE)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
