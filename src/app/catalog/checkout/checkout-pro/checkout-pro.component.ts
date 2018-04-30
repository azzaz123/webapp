import { Component, OnInit } from '@angular/core';
import { ItemWithProducts } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
@Component({
  selector: 'tsl-checkout-pro',
  templateUrl: './checkout-pro.component.html',
  styleUrls: ['./checkout-pro.component.scss']
})
export class CheckoutProComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  itemSelected: ItemWithProducts;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  minDate: NgbDateStruct;
  calendarHidden = true;

  isHovered = date => this.itemSelected.fromDate && !this.itemSelected.toDate && this.hoveredDate && after(date, this.itemSelected.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.itemSelected.fromDate) && before(date, this.itemSelected.toDate);
  isFrom = date => equals(date, this.itemSelected.fromDate);
  isTo = date => equals(date, this.itemSelected.toDate);

  constructor(private itemService: ItemService, private router: Router, private calendar: NgbCalendar) {
    this.minDate = { year: calendar.getToday().year, month: calendar.getToday().month, day: calendar.getToday().day };
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

  onDateFocus(item: ItemWithProducts) {
    this.itemSelected = item;
    this.calendarHidden = false;
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.itemSelected.fromDate && !this.itemSelected.toDate) {
      this.itemSelected.fromDate = date;
    } else if (this.itemSelected.fromDate && !this.itemSelected.toDate && after(date, this.itemSelected.fromDate)) {
      this.itemSelected.toDate = date;
    } else {
      this.itemSelected.toDate = null;
      this.itemSelected.fromDate = date;
    }
  }
}
