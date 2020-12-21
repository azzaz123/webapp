import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PublicProfileService } from '../core/services/public-profile.service';

@Component({
  selector: 'tsl-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  public userId: string;
  public userStats: UserStats;
  public userInfo: User;
  public loading = false;
  private subscriptions: Subscription[] = [];

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
    }
  }

  private getUserInfoAndStats(): void {
    this.loading = true;
    this.subscriptions.push(
      forkJoin([
        this.publicProfileService.getUser(this.userId),
        this.publicProfileService.getStats(this.userId),
        this.publicProfileService.getCoverImage(this.userId),
      ])
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          ([userInfo, userStats, coverImage]: [User, UserStats, Image]) => {
            this.userInfo = userInfo;
            this.userInfo.coverImage = coverImage;
            this.userStats = userStats;
          }
        )
    );
  }
}
