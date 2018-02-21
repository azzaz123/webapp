import { Component, Input, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import * as _ from 'lodash';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart-item.interface';
import { BUMP_TYPES } from '../cart/cart';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit {

  types: string[] = BUMP_TYPES;
  durations: string[];
  duration: string;
  selectedType: string;
  selectedDuration: string;

  @Input() itemWithProducts: ItemWithProducts;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.durations = _.keys(this.itemWithProducts.products);
    this.duration = this.durations[1];
  }

  select(type: string) {
    this.selectedType = type;
    this.selectedDuration = this.duration;
    const cartItem: CartItem = {
      item: this.itemWithProducts.item,
      duration: this.itemWithProducts.products[this.selectedDuration][type]
    };
    this.cartService.cart.add(cartItem, type);
  }

}
