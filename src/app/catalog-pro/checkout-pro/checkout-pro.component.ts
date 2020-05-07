import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarDates } from './range-datepicker/calendar-dates';
import { CartProItem } from '../../shared/catalog/cart/cart-item.interface';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';
import { Subject } from 'rxjs';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: CartProItem;
  calendarHidden = true;
  selectAllEventSubject: Subject<{}> = new Subject<{}>();
  allSelectedCityBump: boolean;
  allSelectedCountryBump: boolean;
  allSelectedPlanning: boolean;
  calendarType: string;
  newSelectedDates: CalendarDates;
  todayDate: NgbDate;
  tomorrowDate: NgbDate;
  newBumpType: string;
  
  constructor(private itemService: ItemService,
              private router: Router,
              private cartService: CartService,
              private route: ActivatedRoute,
              private calendar: NgbCalendar) {
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
    this.calendarType = null;
    this.itemSelected = {... item};
    this.newBumpType = this.itemSelected.bumpType;
    this.newSelectedDates = item.selectedDates;
    this.toggleCalendar();
  }

  onApplyCalendar(datesFromCalendar: CalendarDates) {
    this.newSelectedDates = datesFromCalendar;
    this.toggleCalendar();
    if (this.calendarType === 'planning') {
      this.selectAllEventSubject.next({type: this.calendarType, allSelected: false, dates: datesFromCalendar});
      this.allSelectedPlanning = false;
      
    } else {
      this.itemSelected.selectedDates = datesFromCalendar;
      this.addToCart();
    }
    this.calendarType = null;
  }

  addToCart() {
    this.cartService.add(this.itemSelected, this.itemSelected.bumpType);
    this.toggleCalendar();
  }

  selectAll(type: string): void {
    this.calendarType = type;
    this.newBumpType = type;
    if (type === 'citybump') {
      this.allSelectedCityBump = !this.allSelectedCityBump;
      if (this.allSelectedCountryBump === true) {
        this.allSelectedCountryBump = false;
      }
      this.selectAllEventSubject.next({type, allSelected: this.allSelectedCityBump});
    }
    if (type === 'countrybump') {
      this.allSelectedCountryBump = !this.allSelectedCountryBump;
      if (this.allSelectedCityBump === true) {
        this.allSelectedCityBump = false;
      }
      this.selectAllEventSubject.next({type, allSelected: this.allSelectedCountryBump});
    }
    if (type === 'planning') {
      if (!this.newSelectedDates) {
        this.todayDate = this.calendar.getToday();
        this.tomorrowDate = this.calendar.getNext(this.todayDate);
        this.newSelectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
      }
      this.toggleCalendar();
    }
  }

  private toggleCalendar() {
    this.calendarHidden = !this.calendarHidden;
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

}
