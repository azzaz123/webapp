import { Component, OnInit } from '@angular/core';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { BUMP_TYPES, CartBase } from '../../cart/cart-base';
import { CartPro } from '../../cart/cart-pro';
import { OrderPro } from '../../../../core/item/item-response.interface';
import { ItemService } from '../../../../core/item/item.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss']
})
export class CartProComponent implements OnInit {

  public cart: CartBase;
  public types: string[] = BUMP_TYPES;

  constructor(private cartService: CartService, private itemService: ItemService) {
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
    const order: OrderPro[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    console.log('order', order, orderId);
    this.itemService.bumpProProducts(order, orderId).subscribe((failedProducts: string[]) => {
      console.log(failedProducts);
    }, (error: Response) => {

    });
  }
}
