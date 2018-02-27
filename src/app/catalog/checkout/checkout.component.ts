import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { EventService } from '../../core/event/event.service';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];

  constructor(private itemService: ItemService,
              private event: EventService) {
  }

  ngOnInit() {
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      this.itemsWithProducts = itemsWithProducts;
    });
  }

  public showTutorial() {
    this.event.emit(EventService.SHOW_BUMP_TUTORIAL);
  }

}
