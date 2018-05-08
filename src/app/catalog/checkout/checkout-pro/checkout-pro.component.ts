import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { Router } from '@angular/router';
import { CalendarDates } from './range-datepicker/calendar-dates.interface';
import { CartProItem } from '../cart/cart-item.interface';
import { CartService } from '../cart/cart.service';
import { CartPro } from '../cart/cart-pro';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;

  constructor(private itemService: ItemService, private router: Router, private cartService: CartService) {
    this.cartService.createInstance(new CartPro());
  }

  ngOnInit() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems)
      .subscribe((itemsWithProducts: ItemWithProducts[]) => {
        this.itemsWithProducts = itemsWithProducts;
      });
  }

  onDateFocus(item: CartProItem) {
    this.itemSelected = item;
    this.calendarHidden = false;
  }

  onApplyCalendar(calendar: CalendarDates) {
    this.itemSelected.selectedDates.fromDate = calendar.fromDate;
    this.itemSelected.selectedDates.toDate = calendar.toDate;
    this.itemSelected.selectedDates.formattedFromDate = calendar.formattedFromDate;
    this.itemSelected.selectedDates.formattedToDate = calendar.formattedToDate;
    this.itemSelected.selectedDates.numberOfDays = calendar.numberOfDays;
    this.addToCart();
  }

  addToCart() {
    this.cartService.add(this.itemSelected, this.itemSelected.bumpType);
    this.hideCalendar();
  }

  hideCalendar() {
    this.calendarHidden = true;
  }
}
