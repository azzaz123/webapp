import { Component, OnInit } from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { ItemsData } from '@core/item/item-response.interface';
import { UserService } from '@core/user/user.service';
import { UserStats, Counters } from '@core/user/user-stats.interface';
import { Item } from '@core/item/item';
import { ProfilesData } from '@core/profile/profile-response.interface';
import { ProfileService } from '@core/profile/profile.service';
import { Profile } from '@core/profile/profile';

@Component({
  selector: 'tsl-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  public items: Item[] = [];
  public profiles: Profile[] = [];
  public selectedStatus = 'products';
  public loading = false;
  public end = false;
  public numberOfFavorites: number;
  private counters: Counters;

  constructor(public itemService: ItemService, private userService: UserService, private profileService: ProfileService) {}

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
    this.profileService.myFavorites(this.profiles.length).subscribe((profilesData: ProfilesData) => {
      const profiles = profilesData.data;
      this.profiles = this.profiles.concat(profiles);
      this.loading = false;
      this.end = !profilesData.init;
    });
  }

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public onFavoriteProfileChange(profile: Profile) {
    this.removeProfile(profile);
  }

  public removeProfile(profile: Profile) {
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
    this.selectedStatus === 'products' ? this.getItems(true) : this.getProfiles(true);
  }

  public getNumberOfFavorites() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
      this.setNumberOfFavorites();
    });
  }

  private setNumberOfFavorites() {
    this.numberOfFavorites = this.selectedStatus === 'products' ? this.counters.favorites : this.counters.profile_favorited;
  }
}
