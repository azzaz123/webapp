import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import * as _ from 'lodash';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartChange, CartItem } from '../../../shared/catalog/cart/cart-item.interface';
import {BUMP_PROVINCIAL_TYPES, BUMP_TYPES} from '../../../shared/catalog/cart/cart-base';
import { Cart } from '../../../shared/catalog/cart/cart';
import { PaymentService } from '../../../core/payments/payment.service';
import { CreditInfo } from '../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit, OnDestroy {

  @Input() creditInfo: CreditInfo;
  @Input() itemWithProducts: ItemWithProducts;

  private active = true;
  types: string[] = BUMP_TYPES;
  durations: string[];
  duration: string;
  selectedType: string;
  selectedDuration: string;
  provincialBump: boolean;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.createInstance(new Cart());
    this.durations = _.keys(this.itemWithProducts.products);
    this.duration = this.durations[1];
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
    this.provincialBump = !this.itemWithProducts.products['168'].citybump;
    if (this.provincialBump) {
      this.types = BUMP_PROVINCIAL_TYPES;
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

  select(type: string) {
    if (this.selectedType === type && this.selectedDuration === this.duration) {
      this.cartService.remove(this.itemWithProducts.item.id, type);
      return;
    }
    this.selectedType = type;
    this.selectedDuration = this.duration;
    this.itemWithProducts.item.flags.bump_type = type;
    this.itemWithProducts.item.flags.bumped = true;
    const cartItem: CartItem = {
      item: this.itemWithProducts.item,
      duration: this.itemWithProducts.products[this.selectedDuration][type]
    };
    this.cartService.add(cartItem, type);
  }

  private onRemoveOrClean(cartChange: CartChange) {
    if (cartChange.action === 'remove' && cartChange.itemId === this.itemWithProducts.item.id
      || cartChange.action === 'clean') {
      this.selectedType = undefined;
      this.selectedDuration = undefined;
      this.itemWithProducts.item.flags.bump_type = undefined;
      this.itemWithProducts.item.flags.bumped = false;
    }
  }

}
