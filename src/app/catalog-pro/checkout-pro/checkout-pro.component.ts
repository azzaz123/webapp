import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarDates } from './range-datepicker/calendar-dates';
import { CartProItem } from '../../shared/catalog/cart/cart-item.interface';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;

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

  private toggleCalendar() {
    this.calendarHidden = !this.calendarHidden;
  }
}
