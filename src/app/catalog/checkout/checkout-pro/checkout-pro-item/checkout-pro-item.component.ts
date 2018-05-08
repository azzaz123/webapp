import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { CartPro } from '../../cart/cart-pro';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() cartProItem: CartProItem;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor(private calendar: NgbCalendar, private cartService: CartService) {
    this.cartService.createInstance(new CartPro());
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
  }
  ngOnInit() {
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  selectBump(type: string) {
    if (!this.cartProItem.formattedFromDate && !this.cartProItem.formattedToDate) {
      this.cartProItem.formattedFromDate = moment(new Date()).format('DD/MM/YYYY');
      this.cartProItem.formattedToDate = moment(new Date()).add(1, 'days').format('DD/MM/YYYY');
      this.cartProItem.numberOfDays = 1;
    }
    if (this.cartProItem.bumpType === type) {
      this.removeItem();
    } else {
      this.cartProItem.bumpType = type;
      this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    }
  }

  onRemoveOrClean(cartProChange: CartChange) {
    if (cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id || cartProChange.action === 'clean') {
      delete this.cartProItem.fromDate;
      delete this.cartProItem.toDate;
      delete this.cartProItem.formattedFromDate;
      delete this.cartProItem.formattedToDate;
      delete this.cartProItem.bumpType;
    }
  }

  removeItem() {
    this.cartService.remove(this.cartProItem.item.id, this.cartProItem.bumpType);
  }
}
