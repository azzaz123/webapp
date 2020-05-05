import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CalendarDates } from '../range-datepicker/calendar-dates';
import { CartChange, CartProItem } from '../../../shared/catalog/cart/cart-item.interface';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartPro } from '../../../shared/catalog/cart/cart-pro';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  todayDate: NgbDate;
  tomorrowDate: NgbDate;
  private eventsSubscription: Subscription;

  @Input() cartProItem: CartProItem;
  @Input() events: Observable<string>;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor(private cartService: CartService, private calendar: NgbCalendar) {
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
    this.todayDate = calendar.getToday();
    this.tomorrowDate = calendar.getNext(this.todayDate);
  }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());
    this.cartProItem.selectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
    this.eventsSubscription = this.events.subscribe((data) => this.selectAll(data));
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  onRemoveOrClean(cartProChange: CartChange) {
    if (cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id || cartProChange.action === 'clean') {
      delete this.cartProItem.bumpType;
      this.cartProItem.selectedDates.fromDate = this.todayDate;
      this.cartProItem.selectedDates.toDate = this.tomorrowDate;
    }
  }

  private selectAll(type: string): void {
    this.selectBump(type)
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
