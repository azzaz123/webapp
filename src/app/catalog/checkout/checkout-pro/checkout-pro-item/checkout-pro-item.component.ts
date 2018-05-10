import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { CartPro } from '../../cart/cart-pro';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CalendarDates } from '../range-datepicker/calendar-dates';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() cartProItem: CartProItem;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor(private cartService: CartService, private calendar: NgbCalendar) {
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
  }

  ngOnInit() {
    const todayDate = this.calendar.getToday();
    const tomorrowDate = this.calendar.getNext(todayDate);
    this.cartService.createInstance(new CartPro());
    this.cartProItem.selectedDates = new CalendarDates(todayDate, tomorrowDate);
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  onRemoveOrClean(cartProChange: CartChange) {
    if (cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id || cartProChange.action === 'clean') {
      delete this.cartProItem.bumpType;
    }
  }

  selectBump(type: string) {
    if (this.cartProItem.bumpType === type) {
      this.removeItem();
    } else {
      this.cartProItem.bumpType = type;
      this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    }
  }

  removeItem() {
    this.cartService.remove(this.cartProItem.item.id, this.cartProItem.bumpType);
  }
}
