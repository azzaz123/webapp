import { Component, OnInit } from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { ItemsData } from '@core/item/item-response.interface';
import { UserService } from '@core/user/user.service';
import { UserStats, Counters } from '@core/user/user-stats.interface';
import { Item } from '@core/item/item';
import { ProfilesData } from '@core/profile/profile-response.interface';
import { ProfileService } from '@core/profile/profile.service';
import { Profile } from '@core/profile/profile';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  public items: Item[] = [];
  public profiles: Profile[] = [];
  public selectedStatus = 'products';
  public loading = false;
  public end = false;
  public numberOfFavorites: number;
  private counters: Counters;

  constructor(
    public itemService: ItemService,
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getNumberOfFavorites();
  }

  public routesByStatus(status: string) {
    if (status !== this.selectedStatus) {
      this.selectedStatus = status;
      this.selectedStatus === 'products'
        ? this.router.navigateByUrl('/favorites/products')
        : this.router.navigateByUrl('/favorites/profiles');
      this.getNumberOfFavorites();
    }
  }
  /* 
  public getProfiles(append?: boolean, shouldRoute?: boolean) {
    this.loading = true;
    if (!append) {
      this.profiles = [];
    }
    this.profileService
      .myFavorites(this.profiles.length)
      .subscribe((profilesData: ProfilesData) => {
        const profiles = profilesData.data;
        this.profiles = this.profiles.concat(profiles);
        this.loading = false;
        this.end = !profilesData.init;
        if (shouldRoute) {
          this.router.navigateByUrl('/favorites/profiles', {
            state: { data: this.profiles },
          });
        }
      });
  } */

  /*   public onFavoriteChange(item: Item) {
    this.removeItem(item);
  } */

  /*   public onFavoriteProfileChange(profile: Profile) {
    this.removeProfile(profile);
  } */

  /*   public removeProfile(profile: Profile) {
    if (this.profiles.length) {
      const index = this.profiles.indexOf(profile);
      this.profiles.splice(index, 1);
      this.numberOfFavorites--;
    }
  } */

  /*   public removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.numberOfFavorites--;
    }
  } */

  public getNumberOfFavorites() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
      this.setNumberOfFavorites();
    });
  }

  private setNumberOfFavorites() {
    this.numberOfFavorites =
      this.selectedStatus === 'products'
        ? this.counters.favorites
        : this.counters.profile_favorited;
  }
}
