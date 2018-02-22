import { Component, OnInit } from '@angular/core';
import { ItemService } from '../core/item/item.service';
import { ItemsData } from '../core/item/item-response.interface';
import { Item } from 'shield';
import { UserService } from '../core/user/user.service';
import { UserStatsResponse } from '../core/user/user-stats.interface';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = false;
  public end: boolean = false;
  public favoritesNum: number;

  public masonryOptions = {
    gutter: 20
  };

  constructor(public itemService: ItemService, private userService: UserService) { }

  ngOnInit() {
    this.getItems();
    this.getFavoritesNum();
  }

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.myFavorites(this.items.length).subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.items = this.items.concat(items);
      this.loading = false;
      this.end = !itemsData.init;
    });
  }

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.favoritesNum--;
    }
  }

  public loadMore() {
    this.getItems(true);
  }

  public getFavoritesNum() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.favoritesNum = userStats.counters.favorites;
    });
  }

}
