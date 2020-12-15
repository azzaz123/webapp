import { Component, Input } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';
import { UserInfo } from '../../core/public-profile.interface';

@Component({
  selector: 'tsl-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent {
  @Input() userStats: UserStats;
  @Input() userInfo: UserInfo;
  isPhone = false;

  constructor() {}

  togglePhone(): void {
    this.isPhone = !this.isPhone;
  }

  showLocation(): void {}
}
