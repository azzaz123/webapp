import { Injectable } from '@angular/core';
import { CartItem, CartItems } from './cart-item.interface';

@Injectable()
export class CartService {

  cartItems: CartItems = {
    zonebump: [],
    citybump: [],
    countrybump: []
  };

  constructor() {
  }

  add(cartItem: CartItem, type: string) {
    this.cartItems[type].push(cartItem);
  }

}
