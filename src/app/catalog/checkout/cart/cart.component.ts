import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { BUMP_TYPES, Cart } from './cart';
import { CartChange, CartItem } from './cart-item.interface';
import { Order } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Response } from '@angular/http';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  private active = true;
  public cart: Cart;
  public types: string[] = BUMP_TYPES;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();

  constructor(private cartService: CartService,
              private itemService: ItemService,
              private errorService: ErrorsService) {
  }

  ngOnInit() {
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  remove(cartItem: CartItem, type: string) {
    this.cartService.remove(cartItem.item.id, type);
  }

  clean() {
    this.cartService.clean();
  }

  checkout() {
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    this.itemService.purchaseProducts(order, orderId).subscribe((failedProducts: string[]) => {
      if (failedProducts && failedProducts.length) {
        this.errorService.i18nError('bumpError');
      } else {
        this.sabadellSubmit.emit(orderId);
      }
    }, (error: Response) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

}
