import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/user/user';
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
    this.getUserId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private getUserId(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params.id;
      if (this.userId) {
        this.getUserInformation();
      }
    });
  }

  private getUserInformation(): void {
    this.subscriptions.push(
      forkJoin([
        this.publicProfileService.getUser(this.userId),
        this.publicProfileService.getStats(this.userId),
      ]).subscribe(([userInfo, userStats]: [User, UserStats]) => {
        this.userInfo = userInfo;
        this.userStats = userStats;
      })
    );
  }
}
