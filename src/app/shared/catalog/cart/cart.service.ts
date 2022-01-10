import { Injectable } from '@angular/core';
import { CartChange, CartItem, CartProItem, CartProExtrasPack } from './cart-item.interface';
import { Subject, Observable } from 'rxjs';
import { CartBase } from './cart-base';

@Injectable()
export class CartService {
  public cart$: Observable<CartChange>;
  private cartSource: Subject<CartChange> = new Subject();
  private cart: CartBase;

  constructor() {
    this.cart$ = this.cartSource.asObservable();
  }

  createInstance(cart: CartBase) {
    this.cart = cart;
  }

  add(cartItem: CartItem | CartProItem, type: string) {
    this.cart.add(cartItem, type);
    this.cartSource.next({
      action: 'add',
      cart: this.cart,
      itemId: cartItem.item.id,
      type: type,
    });
  }

  remove(itemId: string, type: string) {
    this.cart.removeCartItem(itemId, type);
    this.cartSource.next({
      action: 'remove',
      cart: this.cart,
      itemId: itemId,
      type: type,
    });
  }

  clean() {
    this.cart.clean();
    this.cartSource.next({
      action: 'clean',
      cart: this.cart,
    });
  }

  addProExtras(cartPack: CartProExtrasPack, type: string) {
    this.cart.add(cartPack, type);
    this.cartSource.next({
      action: 'add',
      cart: this.cart,
      packId: cartPack.pack.id,
      type: type,
    });
  }

  removeProExtras(packId: string, type: string, index: number) {
    this.cart.removeCartItem(type, packId, index);
    this.cartSource.next({
      action: 'remove',
      cart: this.cart,
      packId: packId,
      type: type,
    });
  }
}
