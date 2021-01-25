import { Component, Input } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { SIZE } from '@public/shared/constants/user-basic-info-constants';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent {
  public readonly SIZE = SIZE;
  @Input() userStats: UserStats;
  @Input() userInfo: User;

  constructor() {}

  isProAndHaveDescription(): boolean {
    return !!(this.userInfo.featured && this.userInfo.extraInfo?.description);
  }
}
