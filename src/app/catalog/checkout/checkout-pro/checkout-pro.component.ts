import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { Router } from '@angular/router';
import { CartProService } from './cart-pro/cart-pro.service';
import { CartProItem } from './cart-pro/cart-pro-item.interface';
import { CalendarDates } from './range-datepicker/calendar-dates';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;

  constructor(private itemService: ItemService, private router: Router, private cartProService: CartProService) { }

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
    this.itemSelected.fromDate = calendar.fromDate;
    this.itemSelected.toDate = calendar.toDate;
    this.hideCalendar();
  }

  addToCart() {
    this.cartProService.add(this.itemSelected);
    this.hideCalendar();
  }

  hideCalendar() {
    this.calendarHidden = true;
  }

}
