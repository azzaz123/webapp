import { Injectable } from '@angular/core';
import { CartProItem, CartProChange } from './cart-pro-item.interface';
import { CartPro } from './cart-pro';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CartProService {

  private cartSource: Subject<CartProChange> = new Subject();
  private cart: CartPro;
  public cart$: Observable<CartProChange>;

  constructor() {
    this.cart$ = this.cartSource.asObservable();
    this.cart = new CartPro();
  }

  add(item: CartProItem) {
    this.cart.add(item);
    this.cartSource.next({
      action: 'add',
      cart: this.cart,
      itemId: item.item.id,
      type: item.bumpType
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
}
