import { Component, OnInit } from '@angular/core';
import { ItemService } from '../core/item/item.service';
import { ItemsData } from '../core/item/item-response.interface';
import { UserService } from '../core/user/user.service';
import { UserStatsResponse, Counters } from '../core/user/user-stats.interface';
import { Item } from '../core/item/item';
import { ProfilesData, UserProfile } from '../core/user/user-response.interface';
import { User } from '../core/user/user';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public items: Item[] = [];
  public profiles: UserProfile[] = [];
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
      this.selectedStatus === 'products' ? this.getItems() : this.getProfiles();
      this.getNumberOfFavorites();
    }
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

  public getProfiles(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.profiles = [];
    }
    this.userService.myFavorites(this.items.length).subscribe((profilesData: ProfilesData) => {
      const profiles = profilesData.data;
      this.profiles = this.profiles.concat(profiles);
      this.loading = false;
      this.end = !profilesData.init;
    });
  }

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public onFavoriteProfileChange(profile: UserProfile) {
    this.removeProfile(profile);
  }

  public removeProfile(profile: UserProfile) {
    if (this.profiles.length) {
      const index = this.profiles.indexOf(profile);
      this.profiles.splice(index, 1);
      this.numberOfFavorites--;
    }
  }

  public removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.numberOfFavorites--;
    }
  }

  public loadMore() {
    if (this.selectedStatus === 'products') {
      this.getItems(true);
    } else if (this.selectedStatus === 'profiles') {
      this.getProfiles(true);
    }
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
