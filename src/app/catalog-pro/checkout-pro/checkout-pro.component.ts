import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarDates } from './range-datepicker/calendar-dates';
import { CartService } from '../../shared/catalog/cart/cart.service';
import { CartPro } from '../../shared/catalog/cart/cart-pro';
import { Subject } from 'rxjs';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';


export enum BUMPS {
  CITY = 'citybump',
  COUNTRY = 'countrybump',
  PLANNING = 'planning'
}
const CATALOG_PRO_LIST_URL = 'pro/catalog/list';

@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  calendarHidden = true;
  selectAllEventSubject: Subject<{}> = new Subject<{}>();
  calendarType: string;
  newSelectedDates: CalendarDates;
  todayDate: NgbDate;
  tomorrowDate: NgbDate;

  allSelected = {
    countrybump: false,
    citybump: false,
    planning: false
  }
  
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
  
  public onApplyCalendar(datesFromCalendar: CalendarDates): void {
    this.newSelectedDates = datesFromCalendar;
    this.toggleCalendar();
    if (this.calendarType === BUMPS.PLANNING) {
      this.selectAllEventSubject.next({type: this.calendarType, allSelected: false, dates: datesFromCalendar});
      this.allSelected.planning = false;
      
    }
    this.calendarType = null;
  }

  public selectAll(type: string): void {
    this.calendarType = type;

    if (type !== BUMPS.PLANNING) {
      this.allSelected[type] = !this.allSelected[type];
      if (type === BUMPS.CITY && this.allSelected.countrybump) {	
        this.allSelected.countrybump = false;	
      }	
      if (type === BUMPS.COUNTRY && this.allSelected.citybump) {	
        this.allSelected.citybump = false;	
      }
      this.selectAllEventSubject.next({type, allSelected: this.allSelected[type]});
    } else {
      this.setDefaultDates();
      this.toggleCalendar();
    }
  }

  private setDefaultDates(): void {
    if (!this.newSelectedDates) {
      this.todayDate = this.calendar.getToday();
      this.tomorrowDate = this.calendar.getNext(this.todayDate);
      this.newSelectedDates = new CalendarDates(this.todayDate, this.tomorrowDate);
    }
  }

  private toggleCalendar(): void {
    this.calendarHidden = !this.calendarHidden;
  }

  private getProductsFromSelectedItems() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate([CATALOG_PRO_LIST_URL]);
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
          this.router.navigate([CATALOG_PRO_LIST_URL, {alreadyFeatured: true}]);
        }
      });
  }

}
