import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CartProItem, CartProChange } from '../cart-pro/cart-pro-item.interface';
import { CartProService } from '../cart-pro/cart-pro.service';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() cartProItem: CartProItem;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor(private calendar: NgbCalendar, private cartProService: CartProService) {
    this.cartProService.cart$.subscribe((cartProChange: CartProChange) => {
      this.onRemoveOrClean(cartProChange);
    });
  }

  ngOnInit() {
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  selectBump(type: string) {
    if (!this.cartProItem.fromDate && !this.cartProItem.toDate) {
      this.cartProItem.fromDate = this.calendar.getToday();
      this.cartProItem.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    }
    this.cartProItem.bumpType === type ? this.removeItem() : this.cartProItem.bumpType = type;
    this.cartProService.add(this.cartProItem);
  }

  onRemoveOrClean(cartProChange: CartProChange) {
    if (cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id || cartProChange.action === 'clean') {
      delete this.cartProItem.fromDate;
      delete this.cartProItem.toDate;
      delete this.cartProItem.bumpType;
    }
  }

  removeItem() {
    this.cartProService.remove(this.cartProItem.item.id, this.cartProItem.bumpType);
  }
}
