import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { User } from '@core/user/user';
import { UserStatsWithShipping } from '@core/user/user-stats.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PUBLIC_PROFILE_PATHS } from '../../public-profile-routing-constants';

@Component({
  selector: 'tsl-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent {
  @Input() userStats: UserStatsWithShipping;
  @Input() userInfo: User;
  public showPhone = false;

  constructor(private deviceService: DeviceDetectorService, private router: Router, private scrollIntoViewService: ScrollIntoViewService) {}

  togglePhone(): void {
    this.showPhone = !this.showPhone;
  }

  public showLocation(): void {
    const URL = `${this.cleanCurrentURL()}${PUBLIC_PROFILE_PATHS.INFO}`;

    this.router.navigate([URL]);

    if (this.deviceService.isMobile()) {
      setTimeout(() => {
        this.scrollIntoViewService.scrollToSelector('#map');
      });
    }
  }

  private cleanCurrentURL(): string {
    const URL = this.router.url;
    let to = URL.lastIndexOf('/');
    to = to == -1 ? URL.length : to + 1;
    return URL.substring(0, to);
  }
}
