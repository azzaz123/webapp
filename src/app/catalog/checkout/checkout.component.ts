import { Component, OnInit, EventEmitter } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  public bumpTutorial: EventEmitter<any> = new EventEmitter();

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      this.itemsWithProducts = itemsWithProducts;
    });
  }

  public showTutorial() {
    this.bumpTutorial.emit();
  }

}
