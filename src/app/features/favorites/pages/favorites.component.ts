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
  public isDataPassed = false;
  private counters: Counters;

  constructor(
    public itemService: ItemService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getNumberOfFavorites();
  }

  onActivate(componentReference) {
    if (
      !componentReference.onFavoriteItemPageChange ||
      !componentReference.onFavoriteProfilePageChange
    )
      return;
    componentReference.onFavoriteItemPageChange.subscribe((isItemRemoved) => {
      if (isItemRemoved) {
        this.numberOfFavorites--;
      }
    });

    componentReference.onFavoriteProfilePageChange.subscribe(
      (isProfileRemoved) => {
        if (isProfileRemoved) {
          this.numberOfFavorites--;
        }
      }
    );
  }

  public onItemsPageChange(isDataPassed: boolean) {
    console.log('parentData');
    this.isDataPassed = isDataPassed;
    console.log('isDataPassed', isDataPassed);
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
