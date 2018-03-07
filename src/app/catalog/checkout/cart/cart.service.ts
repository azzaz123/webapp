import { Injectable } from '@angular/core';
import { CartChange, CartItem } from './cart-item.interface';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Cart } from './cart';

@Injectable()
export class CartService {

  private cartSource: Subject<CartChange> = new Subject();
  private cart: Cart;
  public cart$: Observable<CartChange>;

  constructor() {
    this.cart$ = this.cartSource.asObservable();
    this.cart = new Cart();
  }

  add(cartItem: CartItem, type: string) {
    this.cart.add(cartItem, type);
    this.cartSource.next({
      action: 'add',
      cart: this.cart,
      itemId: cartItem.item.id,
      type: type
    });
  }

  remove(itemId: string, type: string) {
    this.cart.removeCartItem(itemId, type);
    this.cartSource.next({
      action: 'remove',
      cart: this.cart,
      itemId: itemId,
      type: type
    });
  }

  clean() {
    this.cart.clean();
    this.cartSource.next({
      action: 'clean',
      cart: this.cart
    });
  }

}
