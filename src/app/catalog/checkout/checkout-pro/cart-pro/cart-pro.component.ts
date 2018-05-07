import { Component, OnInit } from '@angular/core';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { BUMP_TYPES, CartBase } from '../../cart/cart-base';
import { CartPro } from '../../cart/cart-pro';

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss']
})
export class CartProComponent implements OnInit {

  public cart: CartBase;
  public types: string[] = BUMP_TYPES;

  constructor(private cartService: CartService) {
    this.cartService.createInstance(new CartPro());
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
  }

  ngOnInit() {
  }

  remove(cartItem: CartProItem) {
    this.cartService.remove(cartItem.item.id, cartItem.bumpType);
  }

  applyBumps() {
    const order = this.cart.prepareOrder();
    console.log(order);
  }
}
