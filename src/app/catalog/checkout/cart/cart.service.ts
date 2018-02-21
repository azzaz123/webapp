import { Injectable } from '@angular/core';
import { Cart } from './cart';

@Injectable()
export class CartService {

  public cart: Cart;

  constructor() {
    this.cart = new Cart();
  }

}
