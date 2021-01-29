import { Component, Input } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { USER_INFO_SIZE } from '@public/shared/components/user-basic-info/constants/user-basic-info-constants';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent {
  public readonly USER_INFO_SIZE = USER_INFO_SIZE;
  @Input() userStats: UserStats;
  @Input() userInfo: User;

  constructor() {}

  isProAndHaveDescription(): boolean {
    return !!(this.userInfo.featured && this.userInfo.extraInfo?.description);
  }
}
