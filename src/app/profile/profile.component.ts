import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';
import { I18nService } from '../core/i18n/i18n.service';
import { UserStats } from '../core/user/user-stats.interface';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { flatMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public userUrl: string;
  public isPro: boolean;
  public userStats: UserStats;

  constructor(
    private userService: UserService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.userUrl = user.getUrl(this.subdomain);
      this.isPro = user.featured;
    });

    this.userService
      .getStats()
      .subscribe((userStats) => (this.userStats = userStats));
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }
}
