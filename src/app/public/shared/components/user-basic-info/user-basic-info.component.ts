import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import {
  SIZE,
  StyleProperties,
  STYLE_SIZES,
} from '@public/shared/constants/user-basic-info-constants';

@Component({
  selector: 'tsl-user-basic-info',
  templateUrl: './user-basic-info.component.html',
  styleUrls: ['./user-basic-info.component.scss'],
})
export class UserBasicInfoComponent implements OnInit {
  @Input() userStats: UserStats;
  @Input() userInfo: User;
  @Input() size: SIZE;

  ngOnInit(): void {}

  get sizeProperties(): StyleProperties {
    return STYLE_SIZES.find((style) => style.size === this.size);
  }
}
