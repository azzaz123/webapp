import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarDates } from './range-datepicker/calendar-dates';
import { CartProItem } from '../../shared/catalog/cart/cart-item.interface';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';
import { Subject } from 'rxjs';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;
  eventsSubject: Subject<string> = new Subject<string>();
  allSelectedCityBump: boolean;
  allSelectedCountryBump: boolean;
  
  constructor(private itemService: ItemService,
              private router: Router,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());
    this.route.params.subscribe((params: any) => {
      if (params.itemId) {
        this.getProductsFromParamsItem(params.itemId);
      } else {
        this.getProductsFromSelectedItems();
      }
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

  selectAll(type: string): void {
    if (type === 'citybump') {
      this.allSelectedCityBump = !this.allSelectedCityBump;
      if (this.allSelectedCountryBump === true) {
        this.allSelectedCountryBump = false;
      }
    }
    if (type === 'countrybump') {
      this.allSelectedCountryBump = !this.allSelectedCountryBump;
      if (this.allSelectedCityBump === true) {
        this.allSelectedCityBump = false;
      }
    }

    this.eventsSubject.next(type);
  }

  private getProductsFromSelectedItems() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['pro/catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems)
      .subscribe((itemsWithProducts: ItemWithProducts[]) => {
        this.itemsWithProducts = itemsWithProducts;
      });
  }

  private getProductsFromParamsItem(itemId: string) {
    this.itemService.getItemsWithAvailableProducts([itemId])
      .subscribe((itemsWithProducts: ItemWithProducts[]) => {
        if (itemsWithProducts.length) {
          this.itemsWithProducts = itemsWithProducts;
        } else {
          this.router.navigate(['pro/catalog/list', {alreadyFeatured: true}]);
        }
      });
  }

  private toggleCalendar() {
    this.calendarHidden = !this.calendarHidden;
  }

}
