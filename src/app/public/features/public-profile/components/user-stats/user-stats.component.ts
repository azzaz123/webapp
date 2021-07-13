import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { User } from '@core/user/user';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserStats } from '@core/user/user-stats.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { PUBLIC_PROFILE_PATHS } from '../../public-profile-routing-constants';

@Component({
  selector: 'tsl-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent implements OnInit {
  @Input() userStats: UserStats;
  @Input() userInfo: User;
  public readonly PERMISSIONS = PERMISSIONS;
  public showPhone = false;
  public showStoreAdress: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private scrollIntoViewService: ScrollIntoViewService,
    private publicProfileService: PublicProfileService
  ) {}

  ngOnInit() {
    this.showStoreAdress = this.publicProfileService.hasStoreLocation;
  }

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
