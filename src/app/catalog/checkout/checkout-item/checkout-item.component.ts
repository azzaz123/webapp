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
  durations: number[];
  durationForm: FormGroup;

  @Input() itemWithProducts: ItemWithProducts;

  constructor(private fb: FormBuilder) {
    this.durationForm = fb.group({
      duration: ''
    });
  }

  ngOnInit() {
    this.durations = _.keys(this.itemWithProducts.products);
    this.durationForm.get('duration').patchValue(this.durations[1]);
  }

}
