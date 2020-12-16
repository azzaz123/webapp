import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { UserStats, Counters } from '@core/user/user-stats.interface';
import { Router } from '@angular/router';

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

  public onActivate(componentReference) {
    if (
      !componentReference.onFavoriteItemPageChange ||
      !componentReference.onFavoriteProfilePageChange
    )
      return;
    componentReference.onFavoriteItemPageChange.subscribe((isItemRemoved) => {
      console.log(componentReference);
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
