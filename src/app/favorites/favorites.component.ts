import { Component, OnInit } from '@angular/core';

import { ItemService } from '../core/item/item.service';
import { ItemsData } from '../core/item/item-response.interface';
import { Item } from 'shield';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  // public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = false;
  private init: number = 0;
  public end: boolean = false;

  public masonryOptions = {
    gutter: 20
  };

  public items: Item[] = [];

  constructor(public itemService: ItemService
  ) { }

  ngOnInit() {
    this.getItems();
  }

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.myFavorites(this.init).subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.init = itemsData.init;
      this.items = this.items.concat(items);
      this.loading = false;
      this.end = !this.init;
    });
  }

  onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
    }
  }

  public loadMore() {
    this.getItems(true);
  }

}
