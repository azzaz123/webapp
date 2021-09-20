import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { UserStats, Counters } from '@core/user/user-stats.interface';
import { Item } from '@core/item/item';
import { ProfilesData } from '@core/profile/profile-response.interface';
import { ProfileService } from '@core/profile/profile.service';
import { Profile } from '@core/profile/profile';
import { MeApiService } from '@api/me/me-api.service';
import { finalize, take } from 'rxjs/operators';
import { PaginatedList } from '@api/core/model';
import { FavouritesListTrackingEventsService } from '../services/favourites-list-tracking-events.service';

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
  private nextItemParameter: string;

  public constructor(
    public meApiService: MeApiService,
    private userService: UserService,
    private profileService: ProfileService,
    private favouritesListTrackingEventsService: FavouritesListTrackingEventsService
  ) {}

  public ngOnInit() {
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
      this.nextItemParameter = undefined;
    }
    this.meApiService
      .getFavourites(this.nextItemParameter)
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((itemList: PaginatedList<Item>) => {
        this.items = this.items.concat(itemList.list);
        this.nextItemParameter = itemList.paginationParameter;
        this.end = !itemList.paginationParameter;
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

  public trackClickFavoriteItem(index: number) {
    const item = this.items[index];

    this.favouritesListTrackingEventsService.trackClickItemCardEvent(item, index);
  }

  private setNumberOfFavorites() {
    this.numberOfFavorites = this.selectedStatus === 'products' ? this.counters.favorites : this.counters.profile_favorited;
  }
}
