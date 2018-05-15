import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { Router } from '@angular/router';
import { CartProItem } from '../cart/cart-item.interface';
import { CartService } from '../cart/cart.service';
import { CartPro } from '../cart/cart-pro';
import { CalendarDates } from './range-datepicker/calendar-dates';
import { style, state, animate, transition, trigger } from '@angular/core';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;

  constructor(private itemService: ItemService, private router: Router, private cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['pro/catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems)
      .subscribe((itemsWithProducts: ItemWithProducts[]) => {
        this.itemsWithProducts = itemsWithProducts;
      });
  }

  onDateFocus(item: CartProItem) {
    this.itemSelected = item;
    this.toggleCalendar();
  }

  onApplyCalendar(datesFromCalendar: CalendarDates) {
    this.itemSelected.selectedDates = datesFromCalendar;
    this.addToCart();
  }

  addToCart() {
    this.cartService.add(this.itemSelected, this.itemSelected.bumpType);
    this.toggleCalendar();
  }

  toggleCalendar() {
    this.calendarHidden = !this.calendarHidden;
  }
}
