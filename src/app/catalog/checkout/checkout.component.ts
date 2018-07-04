import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { BumpTutorialComponent } from './bump-tutorial/bump-tutorial.component';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  provincialBump: boolean;
  @ViewChild(BumpTutorialComponent) bumpTutorial: BumpTutorialComponent;

  constructor(private itemService: ItemService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.itemId) {
        this.getProductsFromParamsItem(params.itemId);
      } else {
        this.getProductsFromSelectedItems();
      }
    });

  }

  private getProductsFromSelectedItems() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems)
      .subscribe((itemsWithProducts: ItemWithProducts[]) => this.setItems(itemsWithProducts));
  }

  private getProductsFromParamsItem(itemId: string) {
    this.itemService.getItemsWithAvailableProducts([itemId])
      .subscribe((itemsWithProducts: ItemWithProducts[]) => this.setItems(itemsWithProducts));
  }

  private setItems(itemsWithProducts: ItemWithProducts[]) {
    this.itemsWithProducts = itemsWithProducts;
    this.provincialBump = !this.itemsWithProducts[0].products['168'].citybump;
  }

}
