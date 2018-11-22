import { Component, OnInit } from '@angular/core';
import { ItemService } from '../core/item/item.service';
import { ItemsData } from '../core/item/item-response.interface';
import { UserService } from '../core/user/user.service';
import { UserStatsResponse, Counters } from '../core/user/user-stats.interface';
import { Item } from '../core/item/item';
import { ProfilesData } from '../core/user/user-response.interface';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public items: Item[] = [];
  public selectedStatus = 'products';
  public loading = false;
  public end = false;
  public numberOfFavorites: number;
  private counters: Counters;

  constructor(public itemService: ItemService, private userService: UserService) { }

  ngOnInit() {
    this.getItems();
    this.getNumberOfFavorites();
  }

  public filterByStatus(status: string) {
    if (status !== this.selectedStatus) {
      this.selectedStatus = status;
      this.getItems();
      this.getNumberOfFavorites();
    }
  }

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    if (this.selectedStatus === 'products') {
      this.itemService.myFavorites(this.items.length).subscribe((itemsData: ItemsData) => {
        const items = itemsData.data;
        this.items = this.items.concat(items);
        this.loading = false;
        this.end = !itemsData.init;
      });
    } else {
      this.userService.myFavorites(this.items.length).subscribe((itemsData: any) => {
        console.log('component ', itemsData);
        const items = itemsData.data;
        this.items = this.items.concat(items);
        this.loading = false;
        this.end = !itemsData.init;
      });
    }
  }

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.numberOfFavorites--;
    }
  }

  public loadMore() {
    this.getItems(true);
  }

  public getNumberOfFavorites() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
      this.setNumberOfFavorites();
    });
  }

  private setNumberOfFavorites() {
    if (this.selectedStatus === 'products') {
      this.numberOfFavorites = this.counters.favorites;
    } else if (this.selectedStatus === 'profiles') {
      this.numberOfFavorites = this.counters.profile_favorited;
    }
  }

}
