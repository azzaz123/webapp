import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { UserStats, Counters } from '@core/user/user-stats.interface';
import { Router } from '@angular/router';
import { ItemsPageComponent } from '../components/items-page/items-page.component';
import { ProfilesPageComponent } from '../components/profiles-page/profiles-page.component';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  public selectedStatus = 'products';
  public numberOfFavorites: number;
  private counters: Counters;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getNumberOfFavorites();
  }

  public onActivate(
    componentReference: ProfilesPageComponent | ItemsPageComponent
  ) {
    if ((componentReference as ItemsPageComponent).onFavoriteItemPageChange) {
      (componentReference as ItemsPageComponent).onFavoriteItemPageChange.subscribe(
        (isItemRemoved: boolean) => {
          if (isItemRemoved) {
            this.numberOfFavorites--;
          }
        }
      );
    } else if (
      (componentReference as ProfilesPageComponent).onFavoriteProfilePageChange
    ) {
      (componentReference as ProfilesPageComponent).onFavoriteProfilePageChange.subscribe(
        (isProfileRemoved: boolean) => {
          if (isProfileRemoved) {
            this.numberOfFavorites--;
          }
        }
      );
    } else return;
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
