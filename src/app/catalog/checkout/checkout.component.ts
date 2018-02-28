import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  provincialBump: boolean;

  constructor(private itemService: ItemService,
              private router: Router) {
  }

  ngOnInit() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      this.itemsWithProducts = itemsWithProducts;
      this.provincialBump = !this.itemsWithProducts[0].products['48'].citybump;
    });
  }

}
