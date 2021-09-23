import { Component, OnInit } from '@angular/core';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { User } from '@core/user/user';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserStats } from '@core/user/user-stats.interface';
import { UserService } from '@core/user/user.service';
import { PROFILE_PATHS } from '../profile-routing-constants';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: User;
  public userStats: UserStats;
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly PROFILE_PATHS = PROFILE_PATHS;

  constructor(public userService: UserService, public featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.userService.getStats().subscribe((userStats) => (this.userStats = userStats));
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout().subscribe();
  }
}
