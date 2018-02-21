import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { BUMP_TYPES, Cart } from './cart';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  public cart: Cart;
  public types: string[] = BUMP_TYPES;

  constructor(private cartService: CartService) {
    this.cart =  this.cartService.cart;
  }

}
