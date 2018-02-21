import { Injectable } from '@angular/core';
import { CartItem } from './cart-item.interface';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Cart } from './cart';

@Injectable()
export class CartService {

  private cartSource: Subject<Cart> = new Subject();
  private cart: Cart;
  public cart$: Observable<Cart>;

  constructor() {
    this.cart$ = this.cartSource.asObservable();
    this.cart = new Cart();
  }

  add(cartItem: CartItem, type: string) {
    this.cart.add(cartItem, type);
    this.cartSource.next(this.cart);
  }

  remove(itemId: string, type: string) {
    this.cart.removeCartItem(itemId, type);
  }

}
