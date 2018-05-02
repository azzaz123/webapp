import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CartProItem } from '../cart-pro/cart-pro-item.interface';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() cartProItem: CartProItem;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  resetItem() {
    delete this.cartProItem.fromDate;
    delete this.cartProItem.toDate;
    delete this.cartProItem.bumpType;
  }

  selectBump(type: String) {
    this.cartProItem.bumpType === type ? delete this.cartProItem.bumpType : this.cartProItem.bumpType = type;
  }
}
