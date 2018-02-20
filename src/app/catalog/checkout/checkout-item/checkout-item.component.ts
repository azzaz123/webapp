import { Component, Input, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cart-item.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit {

  types: string[] = ['zonebump', 'citybump', 'countrybump'];
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
    this.cartService.add(cartItem, type);
  }

}
