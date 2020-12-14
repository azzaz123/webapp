import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { UserInfo } from '../../core/public-profile.interface';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { UserStats } from '@core/user/user-stats.interface';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  subscriptions: Subscription[] = [];
  userStats: UserStats;
  userInfo: UserInfo;

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.getUserInformation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getUserInformation(): void {
    this.subscriptions.push(
      forkJoin([
        this.publicProfileService.getUser(this.userId),
        this.publicProfileService.getStats(this.userId),
      ]).subscribe(([userInfo, userStats]: [UserInfo, UserStats]) => {
        this.userInfo = userInfo;
        this.userStats = userStats;
      })
    );
  }
}
