import { Component, Input, OnInit } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';
import { USER_INFO_SIZE } from '@public/shared/components/user-basic-info/constants/user-basic-info-constants';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent implements OnInit {
  public readonly USER_INFO_SIZE = USER_INFO_SIZE;
  public readonly PERMISSIONS = PERMISSIONS;
  @Input() userStats: UserStats;
  @Input() userInfo: User;

  public isProAndHasDescription = false;

  constructor() {}

  ngOnInit() {
    this.isProAndHasDescription = !!(this.userInfo.featured && this.userInfo.extraInfo?.description);
  }
}
