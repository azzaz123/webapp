import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CartChange, CartProItem } from '@shared/catalog/cart/cart-item.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartPro } from '@shared/catalog/cart/cart-pro';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CalendarDates } from '@private/features/catalog-pro/core/calendar-dates';

export enum BUMPS {
  CITY = 'citybump',
  COUNTRY = 'countrybump',
  PLANNING = 'planning',
}

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss'],
})
export class CheckoutProItemComponent implements OnInit {
  @Input() cartProItem: CartProItem;
  @Input() selectAllEvent: Observable<any>;
  @Input() index: string;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();
  todayDate: NgbDate;
  tomorrowDate: NgbDate;
  calendarHidden = true;
  calendarType: string;
  newBumpType: string;
  newSelectedDates: CalendarDates;
  public datesForm: FormGroup;

  constructor(private cartService: CartService, private calendar: NgbCalendar, private fb: FormBuilder) {
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
    this.todayDate = calendar.getToday();
    this.tomorrowDate = calendar.getNext(this.todayDate);

    this.datesForm = fb.group({
      fromDate: [{ value: '', disabled: true }],
      toDate: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());
    this.cartProItem.selectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
    const newSelectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
    this.selectAllEvent.subscribe((data) => this.selectAll(data));

    this.patchFormDateValue(newSelectedDates);
  }

  public onDateFocus(): void {
    this.calendarType = null;
    this.newBumpType = this.cartProItem.bumpType;
    this.toggleCalendar();
  }

  public onApplyCalendar(datesFromCalendar: CalendarDates): void {
    this.cartProItem.selectedDates = datesFromCalendar;
    this.patchFormDateValue(datesFromCalendar);
    this.addToCart();
    this.calendarType = null;
  }

  public selectBump(type: string): void {
    this.datesForm.enable();
    if (type === BUMPS.PLANNING) {
      this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    } else {
      if (this.cartProItem.bumpType === type) {
        this.removeItem();
        this.datesForm.disable();
      } else {
        this.cartProItem.bumpType = type;
        this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
      }
    }
  }

  onRemoveOrClean(cartProChange: CartChange): void {
    if ((cartProChange.action === 'remove' && cartProChange.itemId === this.cartProItem.item.id) || cartProChange.action === 'clean') {
      delete this.cartProItem.bumpType;
      this.cartProItem.selectedDates.fromDate = this.todayDate;
      this.cartProItem.selectedDates.toDate = this.tomorrowDate;
      const newSelectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
      this.patchFormDateValue(newSelectedDates);
      this.datesForm.disable();
    }
  }

  public removeItem(): void {
    this.cartService.remove(this.cartProItem.item.id, this.cartProItem.bumpType);
  }

  private patchFormDateValue(dates: CalendarDates): void {
    this.datesForm.patchValue({
      fromDate: dates.formattedFromDate,
      toDate: dates.formattedToDate,
    });
  }

  private addToCart(): void {
    this.cartService.add(this.cartProItem, this.cartProItem.bumpType);
    this.toggleCalendar();
  }

  private toggleCalendar(): void {
    this.calendarHidden = !this.calendarHidden;
  }

  private selectAll(data: any): void {
    if (data.type === BUMPS.PLANNING) {
      this.cartProItem.selectedDates = data.dates;
      this.patchFormDateValue(data.dates);
      this.cartProItem.bumpType && this.selectBump(data.type);
    } else {
      data.allSelected ? this.datesForm.enable() : this.datesForm.disable();
      this.shouldSelectBump(data) && this.selectBump(data.type);
    }
  }

  private shouldSelectBump(data: any): boolean {
    return (
      (this.cartProItem.bumpType === data.type && !data.allSelected) ||
      (!this.cartProItem.bumpType && data.allSelected) ||
      (this.cartProItem.bumpType !== data.type && this.cartProItem.bumpType && data.allSelected)
    );
  }
}
