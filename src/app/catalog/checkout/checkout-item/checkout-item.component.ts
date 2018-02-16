import { Component, Input, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit {

  types: string[] = ['zonebump', 'citybump', 'countrybump'];
  duration: string = '72';

  @Input() itemWithProducts: ItemWithProducts;

  constructor() {
  }

  ngOnInit() {
  }

}
