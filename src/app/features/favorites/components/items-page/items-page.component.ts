import { Component, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { ItemsData } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';

@Component({
  selector: 'tsl-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss'],
})
export class ItemsPageComponent implements OnInit {
  public items: Item[] = [];
  public numberOfFavorites: number;
  public loading = false;
  public end = false;

  constructor(public itemService: ItemService) {}

  ngOnInit(): void {
    this.getItems();
  }

  public loadMore() {
    this.getItems(true);
  }

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public removeItem(item: Item) {
    //EventEmitter
    /*  if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.numberOfFavorites--;
    } */
  }

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService
      .myFavorites(this.items.length)
      .subscribe((itemsData: ItemsData) => {
        const items = itemsData.data;
        this.items = this.items.concat(items);
        this.loading = false;
        this.end = !itemsData.init;
      });
  }
}
