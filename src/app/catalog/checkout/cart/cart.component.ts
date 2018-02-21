import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { BUMP_TYPES, Cart } from './cart';
import { CartItem } from './cart-item.interface';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  private active = true;
  public cart: Cart;
  public types: string[] = BUMP_TYPES;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cart: Cart) => {
      this.cart = cart;
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  remove(cartItem: CartItem, type: string) {
    this.cartService.remove(cartItem.item.id, type);
  }

}
