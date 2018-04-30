import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() itemWithProducts: ItemWithProducts;
  @Output() dateFocus: EventEmitter<ItemWithProducts> = new EventEmitter();

  countryBumpSelected: boolean;
  cityBumpSelected: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onDateFocus() {
    this.dateFocus.emit(this.itemWithProducts);
  }

  resetItem() {
    this.cityBumpSelected = false;
    this.countryBumpSelected = false;
    delete this.itemWithProducts.fromDate;
    delete this.itemWithProducts.toDate;
  }

  selectBump(type: string) {
    if (type === 'city') {
      this.cityBumpSelected = true;
      this.countryBumpSelected = false;
    } else if (type === 'country') {
      this.countryBumpSelected = true;
      this.cityBumpSelected = false;
    }
  }
}
