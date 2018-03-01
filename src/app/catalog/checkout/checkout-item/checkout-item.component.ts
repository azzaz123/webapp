import { Component, Input, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit {

  types: string[] = ['zonebump', 'citybump', 'countrybump'];
  durations: string[];
  selectedDuration: string;

  @Input() itemWithProducts: ItemWithProducts;

  constructor() {
  }

  ngOnInit() {
    this.durations = _.keys(this.itemWithProducts.products);
    this.selectedDuration = this.durations[1];
  }

}
