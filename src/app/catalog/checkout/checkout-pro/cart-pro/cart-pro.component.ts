import { Component, OnInit } from '@angular/core';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { CartBase, BUMP_PRO_TYPES } from '../../cart/cart-base';
import { CartPro } from '../../cart/cart-pro';
import { OrderPro } from '../../../../core/item/item-response.interface';
import { ItemService } from '../../../../core/item/item.service';
import { UUID } from 'angular2-uuid';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss']
})
export class CartProComponent implements OnInit {

  public cart: CartBase = new CartPro();
  public types: string[] = BUMP_PRO_TYPES;

  constructor(private cartService: CartService, private itemService: ItemService, private errorService: ErrorsService, private router: Router) {
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
    this.itemService.bumpProItems(order, orderId).subscribe((failedProducts: string[]) => {
      if (failedProducts && failedProducts.length) {
        this.errorService.i18nError('bumpError');
      } else {
        this.router.navigate(['/pro/catalog/list']);
      }
    }, (error: Response) => {

    });
  }
}
