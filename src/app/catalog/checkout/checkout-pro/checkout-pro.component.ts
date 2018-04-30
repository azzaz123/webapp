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
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  constructor(private itemService: ItemService, private router: Router, calendar: NgbCalendar) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
  }

  ngOnInit() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {            
      this.itemsWithProducts = itemsWithProducts;
      console.log(this.itemsWithProducts);
    });
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

}
