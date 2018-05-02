import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CartProItem } from '../cart-pro/cart-pro-item.interface';
import { CartProService } from '../cart-pro/cart-pro.service';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() cartProItem: CartProItem;
  @Output() dateFocus: EventEmitter<CartProItem> = new EventEmitter();

  constructor(private calendar: NgbCalendar, private cartProService: CartProService) {
  }

  ngOnInit() {
  }

  onDateFocus() {
    this.dateFocus.emit(this.cartProItem);
  }

  resetItem() {
    delete this.cartProItem.fromDate;
    delete this.cartProItem.toDate;
    delete this.cartProItem.bumpType;
  }

  selectBump(type: string) {
    if (!this.cartProItem.fromDate && !this.cartProItem.toDate) {
      this.cartProItem.fromDate = this.calendar.getToday();
      this.cartProItem.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    }
    if (this.cartProItem.bumpType === type) {
      delete this.cartProItem.bumpType;
      delete this.cartProItem.fromDate;
      delete this.cartProItem.toDate;
    } else {
      this.cartProItem.bumpType = type;
    }
    this.cartProService.add(this.cartProItem);
  }
}
