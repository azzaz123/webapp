import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  MAP_REDIRECTION,
  PUBLIC_PROFILE_PATHS,
} from '../../public-profile-routing-constants';

@Component({
  selector: 'tsl-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent {
  @Input() userStats: UserStats;
  @Input() userInfo: User;
  public isPhone = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {}

  togglePhone(): void {
    this.isPhone = !this.isPhone;
  }

  public showLocation(): void {
    const URL = `${this.cleanCurrentURL()}${PUBLIC_PROFILE_PATHS.INFO}`;
    if (this.deviceService.isMobile()) {
      this.router.navigate([URL], { fragment: MAP_REDIRECTION });
    } else {
      this.router.navigate([URL]);
    }
  }

  private cleanCurrentURL(): string {
    const URL = this.router.url;
    let to = URL.lastIndexOf('/');
    to = to == -1 ? URL.length : to + 1;
    return URL.substring(0, to);
  }
}
