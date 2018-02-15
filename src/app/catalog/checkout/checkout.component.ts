import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getItemsWithAvailableProducts(['1']).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      console.log(itemsWithProducts);
    });
  }

}
