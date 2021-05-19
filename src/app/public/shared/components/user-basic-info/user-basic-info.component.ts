import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { USER_INFO_SIZE, StyleProperties, STYLE_SIZES } from './constants/user-basic-info-constants';

@Component({
  selector: 'tsl-user-basic-info',
  templateUrl: './user-basic-info.component.html',
  styleUrls: ['./user-basic-info.component.scss'],
})
export class UserBasicInfoComponent {
  @Input() userStats: UserStats;
  @Input() userInfo: User;
  @Input() styleSize: USER_INFO_SIZE = USER_INFO_SIZE.SMALL;
  @Input() clickable = false;

  constructor(private router: Router) {}

  get sizeProperties(): StyleProperties {
    return STYLE_SIZES.find((style) => style.size === this.styleSize);
  }

  public onClickUser() {
    if (this.clickable) {
      this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${this.userInfo.id}`]);
    }
  }
}
