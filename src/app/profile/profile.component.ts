import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';
import { MotorPlan, MotorPlanType, ProfileSubscriptionInfo } from '../core/user/user-response.interface';
import { I18nService } from '../core/i18n/i18n.service';
import { UserStatsResponse } from '../core/user/user-stats.interface';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { flatMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userUrl: string;
  public isPro: boolean;
  public userStats: UserStatsResponse;
  public loading = false;

  constructor(private userService: UserService,
              protected i18n: I18nService,
              private subscriptionsService: SubscriptionsService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.me().subscribe((user: User) => {
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
        this.isPro = user.featured;
      }
    });

    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.userStats = userStats;
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }
}
