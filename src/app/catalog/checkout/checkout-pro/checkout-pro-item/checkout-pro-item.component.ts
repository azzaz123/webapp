import { Component, OnInit, Input } from '@angular/core';
import { ItemWithProducts } from '../../../../core/item/item-response.interface';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-checkout-pro-item',
  templateUrl: './checkout-pro-item.component.html',
  styleUrls: ['./checkout-pro-item.component.scss']
})

export class CheckoutProItemComponent implements OnInit {

  @Input() itemWithProducts: ItemWithProducts;
  @Input() fromDate: NgbDateStruct;
  @Input() toDate: NgbDateStruct;
  countryBumpSelected: boolean;
  cityBumpSelected: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  selectBump(type: string) {
    if (type === 'city') {
      this.cityBumpSelected = true;
      this.countryBumpSelected = false;
    } else if (type === 'country') {
      this.cityBumpSelected = false;
      this.countryBumpSelected = true;
    }
  }
}
