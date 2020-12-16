import { Component, Input } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';
import { User } from '@core/user/user';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent {
  @Input() userStats: UserStats;
  @Input() userInfo: User;

  constructor() {}
}
