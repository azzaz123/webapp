import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  calendarHidden = true;
  calendarType: string;
  newBumpType: string;
  newSelectedDates: CalendarDates;

  @Input() cartProItem: CartProItem;
  @Input() selectAllEvent: Observable<any>;
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
    this.newSelectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
    this.selectAllEvent.subscribe((data) => this.selectAll(data));
  }

  //new
  onDateFocus(item: CartProItem) {
    this.calendarType = null;
    this.newBumpType = this.cartProItem.bumpType;
    this.newSelectedDates = this.cartProItem.selectedDates;
    this.toggleCalendar();
  }

  onApplyCalendar(datesFromCalendar: CalendarDates) {
    this.newSelectedDates = datesFromCalendar;
    this.cartProItem.selectedDates = datesFromCalendar;
    this.addToCart();
    this.calendarType = null;
  }

  addToCart() {
    this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    this.toggleCalendar();
  }

  private toggleCalendar() {
    this.calendarHidden = !this.calendarHidden;
  }
  
  //
  /*onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }*/

  onRemoveOrClean(cartProChange: CartChange) {
    if (cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id || cartProChange.action === 'clean') {
      delete this.cartProItem.bumpType;
      this.cartProItem.selectedDates.fromDate = this.todayDate;
      this.cartProItem.selectedDates.toDate = this.tomorrowDate;
      //new
      this.newSelectedDates.fromDate = this.todayDate;
      this.newSelectedDates.toDate = this.tomorrowDate;
    }
  }

  private selectAll(data: any): void {
    if (data.type === 'planning') {
      this.newSelectedDates = data.dates;
      this.cartProItem.selectedDates = data.dates;
      if (this.cartProItem.bumpType) {
        this.selectBump(data.type)
      }
    } else {
      if (this.cartProItem.bumpType === data.type && !data.allSelected
        || (!this.cartProItem.bumpType && data.allSelected)
        || this.cartProItem.bumpType !== data.type && this.cartProItem.bumpType && data.allSelected) {
        this.selectBump(data.type)
      }
    }
  }

  selectBump(type: string) {
    if (type === 'planning') {
      this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    } else {
      if (this.cartProItem.bumpType === type) {
        this.removeItem();
      } else {
        this.cartProItem.bumpType = type;
        this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
      }
    }
  }

  removeItem() {
    this.cartService.remove(this.cartProItem.item.id, this.cartProItem.bumpType);
  }
}
