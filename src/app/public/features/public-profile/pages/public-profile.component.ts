import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { forkJoin, Subscription } from 'rxjs';
import { PublicProfileService } from '../core/services/public-profile.service';

@Component({
  selector: 'tsl-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  userId: string;
  subscriptions: Subscription[] = [];
  userStats: UserStats;
  userInfo: User;

  constructor(
    private route: ActivatedRoute,
    private publicProfileService: PublicProfileService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  private getUser(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserInfoAndStats();
    } else {
      this.resetInfo();
    }
  }

  private getUserInfoAndStats(): void {
    this.subscriptions.push(
      forkJoin([
        this.publicProfileService.getUser(this.userId),
        this.publicProfileService.getStats(this.userId),
        this.publicProfileService.getCoverImage(this.userId),
      ]).subscribe(
        ([userInfo, userStats, coverImage]: [User, UserStats, Image]) => {
          this.userInfo = userInfo;
          this.userInfo.coverImage = coverImage;
          this.userStats = userStats;
        }
      )
    );
  }

  private resetInfo(): void {
    // TODO: Check for default user		Date: 2020/12/16
    this.userStats = null;
    this.userInfo = null;
  }
}
