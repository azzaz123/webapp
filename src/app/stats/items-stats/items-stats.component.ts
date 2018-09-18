import { Component, OnInit } from '@angular/core';
import { CheapestProducts, ItemsData } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { Item } from '../../core/item/item';

@Component({
  selector: 'tsl-items-stats',
  templateUrl: './items-stats.component.html',
  styleUrls: ['./items-stats.component.scss']
})
export class ItemsStatsComponent implements OnInit {

  public items: Item[] = [];
  public loading = true;
  private init = 0;
  public end: boolean;
  public opens: boolean[] = [];
  public prices: CheapestProducts;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
  }

  private getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mine(this.init, 'published').subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.init = itemsData.init;
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      this.end = !this.init;
      this.getProductsFromItems();
    });
  }

  public onOpen(index: number) {
    this.opens = this.items.map(_ => false);
    this.opens[index] = true;
  }

  private getProductsFromItems() {
    const itemsIds: string[] = this.items.map((item: Item) => item.id);
    this.itemService.getCheapestProductPrice(itemsIds).subscribe((prices: CheapestProducts) => {
      this.prices = prices;
    });
  }

}
